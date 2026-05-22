import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthLogo from '../../layouts/auth/components/AuthLogo';
import { authService } from '../../api/services/auth.service';
import { toast } from '../../utils/toast';
import { ROUTES } from '../../constants/routes';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { token } = useParams();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      await authService.resetPassword(token, formData.newPassword);
      toast.success('Password reset successful! You can now login.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Password reset failed';
      toast.error(errorMessage);
      
      if (errorMessage.includes('Invalid or expired')) {
        setErrors({ general: 'Reset link is invalid or expired. Please request a new one.' });
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
        Reset Password
      </h2>
      <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        Enter your new password
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
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password (min 6 characters)"
              className="w-full px-4 py-3 rounded-lg transition-all pr-12"
              style={{
                background: 'var(--glass-card)',
                border: `1px solid ${errors.newPassword ? 'var(--status-error)' : 'var(--border-input)'}`,
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
          {errors.newPassword && (
            <p className="mt-1 text-sm" style={{ color: 'var(--status-error)' }}>
              {errors.newPassword}
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
              placeholder="Confirm your new password"
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
              Resetting password...
            </span>
          ) : (
            'Reset Password'
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

export default ResetPassword;
