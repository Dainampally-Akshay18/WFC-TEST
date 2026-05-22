import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLogo from '../../layouts/auth/components/AuthLogo';
import { authService } from '../../api/services/auth.service';
import { toast } from '../../utils/toast';
import { ROUTES } from '../../constants/routes';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail()) {
      return;
    }
    
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      // Always show generic message for security (prevent email enumeration)
      toast.success('If this email exists, a password reset link has been sent.');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <AuthLogo />
        
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Check Your Email
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            If an account exists for {email}, you will receive password reset instructions.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to={ROUTES.LOGIN}
            className="block w-full py-3 rounded-lg font-medium text-center transition-all hover:opacity-90"
            style={{
              background: 'var(--gradient-button)',
              color: 'white',
            }}
          >
            Back to Login
          </Link>

          <button
            onClick={() => {
              setSubmitted(false);
              setEmail('');
            }}
            className="w-full py-3 rounded-lg font-medium transition-all"
            style={{
              background: 'var(--glass-card)',
              border: '1px solid var(--border-input)',
              color: 'var(--text-primary)',
            }}
          >
            Try Another Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AuthLogo />
      
      <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
        Forgot Password?
      </h2>
      <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        Enter your email and we'll send you reset instructions
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              background: 'var(--glass-card)',
              border: `1px solid ${error ? 'var(--status-error)' : 'var(--border-input)'}`,
              color: 'var(--text-primary)',
            }}
            disabled={loading}
          />
          {error && (
            <p className="mt-1 text-sm" style={{ color: 'var(--status-error)' }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            background: 'var(--gradient-button)',
            color: 'white',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm hover:underline"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
