# Fetish App

A premium habit tracking application built with modern web technologies and AWS-native architecture.

## Tech Stack

### Frontend
- **Vite** + **React 18** + **Tailwind CSS 3**
- **Framer Motion** — smooth animations and micro-interactions
- **Glassmorphism** design system with dark theme
- Google OAuth integration

### Backend
- **Node.js** + **Express** (ES modules)
- **PostgreSQL** with connection pooling
- JWT authentication with refresh tokens
- Rate limiting, Helmet security headers, compression

### Infrastructure
- **Docker** — multi-stage builds
- **AWS ECS Fargate** — container orchestration
- **RDS PostgreSQL** — managed database
- **S3 + CloudFront** — static asset hosting + CDN
- **ECR** — Docker image registry
- **GitHub Actions** — CI/CD pipeline

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (via Docker Compose)

### 1. Clone and install
```bash
git clone <repo-url> /home/sorin/FetishApp
cd /home/sorin/FetishApp
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Start PostgreSQL and the server
```bash
docker-compose up -d postgres
cd server
cp .env.example .env  # Edit with your values
npm run dev
```

### 3. Start the client
```bash
cd client
npm run dev
```

Visit **http://localhost:5173**

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `NODE_ENV` | Environment (development/production) |
| `PORT` | Server port (default: 3001) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `CLIENT_URL` | Frontend URL (for CORS) |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_API_URL` | API base URL (for production) |

## Project Structure

```
/home/sorin/FetishApp/
├── client/                    # Vite + React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # React hooks
│   │   ├── context/           # React context providers
│   │   ├── services/          # API client (Axios)
│   │   └── utils/             # Helper functions
│   ├── nginx.conf             # Production nginx config
│   └── vite.config.js
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # Database, auth, env config
│   │   ├── models/            # Database models
│   │   ├── routes/            # API route handlers
│   │   ├── middleware/        # Auth, error handling
│   │   └── services/         # Business logic
│   ├── migrations/            # SQL migrations
│   └── Dockerfile             # Multi-stage Docker build
├── .github/workflows/         # CI/CD pipelines
├── infrastructure/            # AWS setup scripts
├── docker-compose.yml         # Local development
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/google` — Google OAuth login/signup
- `POST /api/auth/refresh` — Refresh access token
- `GET /api/auth/me` — Get current user

### Habits
- `GET /api/habits` — List habits (paginated)
- `POST /api/habits` — Create habit
- `GET /api/habits/:id` — Get habit
- `PUT /api/habits/:id` — Update habit
- `DELETE /api/habits/:id` — Soft-delete habit

### Progress
- `POST /api/progress` — Log progress
- `GET /api/progress/today` — Today's progress
- `GET /api/progress/streaks` — All streaks
- `GET /api/progress/dashboard` — Dashboard stats
- `GET /api/progress/:habitId` — Habit progress history

### User
- `GET /api/user/profile` — Get profile
- `PUT /api/user/profile` — Update profile

## AWS Deployment

### 1. Setup Infrastructure
```bash
cd infrastructure
chmod +x setup.sh
bash setup.sh
```

### 2. Configure GitHub Secrets
| Secret | Description |
|---|---|
| `AWS_ROLE_ARN` | IAM role for GitHub Actions |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |

### 3. Deploy
Push to `main` branch — GitHub Actions handles:
- Building Docker image → push to ECR
- Deploying to ECS Fargate
- Building frontend → sync to S3
- Invalidating CloudFront cache

## Seeded Habits

New users automatically get these 5 habits:
1. ⏰ Wake up on time (daily)
2. 📖 Read every day (daily, 30 min)
3. 💻 Code for at least 30 minutes (daily)
4. 🚶 Go for a walk (daily)
5. 🏆 Manage basic activities like a pro (daily)

## License

MIT
