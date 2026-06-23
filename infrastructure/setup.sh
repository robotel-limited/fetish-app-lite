#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Fetish App — AWS Infrastructure Setup Script
# Idempotent: checks for existing resources before creating.
# Usage: bash setup.sh [--region us-east-1]
# =============================================================================

REGION="${1:-us-east-1}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
APP_NAME="fetish-app"

echo "=== Setting up AWS infrastructure for $APP_NAME in $REGION ==="

# ─── 1. ECR Repository ───────────────────────────────────────────────────────
echo "--- ECR Repository ---"
if aws ecr describe-repositories --repository-names "$APP_NAME" --region "$REGION" &>/dev/null; then
  echo "ECR repository '$APP_NAME' already exists"
else
  aws ecr create-repository \
    --repository-name "$APP_NAME" \
    --image-scanning-configuration scanOnPush=true \
    --region "$REGION"
  echo "Created ECR repository: $APP_NAME"
fi
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${APP_NAME}"

# ─── 2. S3 Bucket ────────────────────────────────────────────────────────────
echo "--- S3 Bucket ---"
S3_BUCKET="${APP_NAME}-client-${ACCOUNT_ID}"
if aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
  echo "S3 bucket '$S3_BUCKET' already exists"
else
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$S3_BUCKET" --region "$REGION"
  else
    aws s3api create-bucket \
      --bucket "$S3_BUCKET" \
      --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION"
  fi
  aws s3api put-public-access-block \
    --bucket "$S3_BUCKET" \
    --public-access-block-configuration BlockPublicAcls=true,BlockPublicPolicy=true,IgnorePublicAcls=true,RestrictPublicBuckets=true
  echo "Created S3 bucket: $S3_BUCKET"
fi

# ─── 3. RDS PostgreSQL Instance ──────────────────────────────────────────────
echo "--- RDS PostgreSQL ---"
DB_INSTANCE="${APP_NAME}-db"
if aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE" --region "$REGION" &>/dev/null; then
  echo "RDS instance '$DB_INSTANCE' already exists"
else
  aws rds create-db-instance \
    --db-instance-identifier "$DB_INSTANCE" \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 16.3 \
    --master-username fetishapp_admin \
    --master-user-password "$(openssl rand -base64 16)" \
    --db-name fetishapp \
    --allocated-storage 20 \
    --storage-type gp3 \
    --publicly-accessible false \
    --backup-retention-period 7 \
    --monitoring-interval 0 \
    --region "$REGION"
  echo "Created RDS instance: $DB_INSTANCE (initializing...)"

  # Wait for instance to be available
  echo "Waiting for RDS instance to become available..."
  aws rds wait db-instance-available --db-instance-identifier "$DB_INSTANCE" --region "$REGION"
  echo "RDS instance is available"

  # Get endpoint
  ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "$DB_INSTANCE" \
    --query "DBInstances[0].Endpoint.Address" \
    --output text \
    --region "$REGION")
  echo "RDS Endpoint: $ENDPOINT"
fi

# ─── 4. ECS Cluster ──────────────────────────────────────────────────────────
echo "--- ECS Cluster ---"
ECS_CLUSTER="${APP_NAME}-cluster"
if aws ecs describe-clusters --cluster "$ECS_CLUSTER" --region "$REGION" | grep -q "ACTIVE"; then
  echo "ECS cluster '$ECS_CLUSTER' already exists"
else
  aws ecs create-cluster --cluster-name "$ECS_CLUSTER" --region "$REGION"
  echo "Created ECS cluster: $ECS_CLUSTER"
fi

# ─── 5. IAM Roles ────────────────────────────────────────────────────────────
echo "--- IAM Roles ---"
ECS_TASK_ROLE="${APP_NAME}-task-role"
ECS_EXEC_ROLE="${APP_NAME}-exec-role"

if aws iam get-role --role-name "$ECS_TASK_ROLE" &>/dev/null; then
  echo "IAM role '$ECS_TASK_ROLE' already exists"
else
  cat > /tmp/ecs-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ecs-tasks.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
EOF
  aws iam create-role \
    --role-name "$ECS_TASK_ROLE" \
    --assume-role-policy-document file:///tmp/ecs-trust-policy.json
  aws iam attach-role-policy \
    --role-name "$ECS_TASK_ROLE" \
    --policy-arn arn:aws:iam::aws:policy/AmazonRDSDataFullAccess

  aws iam create-role \
    --role-name "$ECS_EXEC_ROLE" \
    --assume-role-policy-document file:///tmp/ecs-trust-policy.json
  aws iam attach-role-policy \
    --role-name "$ECS_EXEC_ROLE" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
  echo "Created IAM roles"
fi

# ─── 6. Security Group ───────────────────────────────────────────────────────
echo "--- Security Group ---"
SG_NAME="${APP_NAME}-sg"
SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region "$REGION")" \
  --query "SecurityGroups[0].GroupId" \
  --output text \
  --region "$REGION" 2>/dev/null || echo "")

if [ -z "$SG_ID" ] || [ "$SG_ID" = "None" ]; then
  VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region "$REGION")
  SG_ID=$(aws ec2 create-security-group \
    --group-name "$SG_NAME" \
    --description "Security group for $APP_NAME" \
    --vpc-id "$VPC_ID" \
    --query "GroupId" \
    --output text \
    --region "$REGION")
  aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 3001 \
    --cidr "0.0.0.0/0" \
    --region "$REGION"
  echo "Created security group: $SG_ID"
else
  echo "Security group '$SG_NAME' already exists: $SG_ID"
fi

# ─── 7. CloudFront Distribution (placeholder instructions) ───────────────────
echo ""
echo "=== Setup Summary ==="
echo "ECR Repository:     $ECR_URI"
echo "S3 Bucket:          $S3_BUCKET"
echo "RDS Instance:       $DB_INSTANCE"
echo "ECS Cluster:        $ECS_CLUSTER"
echo "Security Group:     $SG_ID"
echo ""
echo "=== Next Steps ==="
echo "1. Create a CloudFront distribution pointing to S3 bucket: $S3_BUCKET"
echo "2. Create ECS task definition and service (see deploy.yml)"
echo "3. Set the following GitHub Actions secrets:"
echo "   - AWS_ROLE_ARN"
echo "   - CLOUDFRONT_DISTRIBUTION_ID"
echo "4. Run RDS schema: psql -h <RDS_ENDPOINT> -U fetishapp_admin -d fetishapp -f rds-schema.sql"
echo ""
echo "Done!"
