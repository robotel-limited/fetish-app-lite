import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

/**
 * Google OAuth login button with glassmorphism styling
 * @returns {JSX.Element}
 */
export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Login failed');
    }
  };

  const handleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        width="100%"
        shape="pill"
        text="signin_with"
      />
    </div>
  );
}
