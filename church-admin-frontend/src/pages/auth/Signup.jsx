import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLogo from '../../layouts/auth/components/AuthLogo';
import { authService } from '../../api/services/auth.service';
import { toast } from '../../utils/toast';
import { ROUTES } from '../../constants/routes';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    branch: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.branch || formData.branch.trim().length === 0) {
      newErrors.branch = 'Branch is required';
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
      const { confirmPassword, ...signupData } = formData;
      const response = await authService.signup(signupData);
      
      toast.success('Account created successfully! Awaiting admin approval.');
      
      // Redirect to login with success message
      navigate(ROUTES.LOGIN, { 
        state: { 
          message: 'Account created. Please wait for admin approval before logging in.' 
        } 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
      
      if (errorMessage.includes('Email already registered')) {
        setErrors({ email: 'This email is already registered' });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthLogo />
      
      <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
        Create Account
      </h2>
      <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        Join our church community
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
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              background: 'var(--glass-card)',
              border: `1px solid ${errors.name ? 'var(--status-error)' : 'var(--border-input)'}`,
              color: 'var(--text-primary)',
            }}
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm" style={{ color: 'var(--status-error)' }}>
              {errors.name}
            </p>
          )}
        </div>

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
            Branch
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Enter your branch location"
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              background: 'var(--glass-card)',
              border: `1px solid ${errors.branch ? 'var(--status-error)' : 'var(--border-input)'}`,
              color: 'var(--text-primary)',
            }}
            disabled={loading}
          />
          {errors.branch && (
            <p className="mt-1 text-sm" style={{ color: 'var(--status-error)' }}>
              {errors.branch}
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
              placeholder="Create a password (min 6 characters)"
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

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 rounded-lg transition-all pr-12"
              style={{
                background: 'var(--glass-card)',
                border: `1px solid ${errors.confirmPassword ? 'var(--status-error)' : 'var(--border-input)'}`,
                color: 'var(--text-primary)',
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm" style={{ color: 'var(--status-error)' }}>
              {errors.confirmPassword}
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
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium hover:underline"
            style={{ color: 'var(--text-primary)' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
