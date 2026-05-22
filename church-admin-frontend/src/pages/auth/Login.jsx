import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import AuthLogo from '../../layouts/auth/components/AuthLogo';
import { toast } from '../../utils/toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      
      if (errorMessage.includes('not approved')) {
        setErrors({ general: 'Your account is pending approval. Please wait for admin approval.' });
      } else if (errorMessage.includes('Invalid email or password')) {
        setErrors({ general: 'Invalid email or password' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthLogo />
      
      <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
        Welcome Back
      </h2>
      <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        Sign in to your account
      </p>

      {errors.general && (
        <div className="mb-4 p-3 rounded-lg" style={{ 
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          color: 'var(--status-error)'
        }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              background: 'var(--glass-card)',
              border: `1px solid ${errors.email ? 'var(--status-error)' : 'var(--border-input)'}`,
              color: 'var(--text-primary)',
            }}
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm" style={{ color: 'var(--status-error)' }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg transition-all pr-12"
              style={{
                background: 'var(--glass-card)',
                border: `1px solid ${errors.password ? 'var(--status-error)' : 'var(--border-input)'}`,
                color: 'var(--text-primary)',
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm" style={{ color: 'var(--status-error)' }}>
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm hover:underline"
            style={{ color: 'var(--text-secondary)' }}
          >
            Forgot password?
          </Link>
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
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link
            to={ROUTES.SIGNUP}
            className="font-medium hover:underline"
            style={{ color: 'var(--text-primary)' }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
