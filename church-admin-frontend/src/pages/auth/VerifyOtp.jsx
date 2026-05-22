import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLogo from '../../layouts/auth/components/AuthLogo';
import { authService } from '../../api/services/auth.service';
import { toast } from '../../utils/toast';
import { ROUTES } from '../../constants/routes';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.LOGIN);
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setLoading(true);
    try {
      await authService.verifyOtp(email, otpString);
      toast.success('OTP verified successfully!');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'OTP verification failed';
      toast.error(errorMessage);
      setError(errorMessage);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendOtp(email);
      toast.success('New OTP sent to your email');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <AuthLogo />
      
      <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
        Verify OTP
      </h2>
      <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        Enter the 6-digit code sent to<br />
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{email}</span>
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-center" style={{ 
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          color: 'var(--status-error)'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold rounded-lg transition-all"
              style={{
                background: 'var(--glass-card)',
                border: `2px solid ${error ? 'var(--status-error)' : digit ? 'var(--text-primary)' : 'var(--border-input)'}`,
                color: 'var(--text-primary)',
              }}
              disabled={loading}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            background: 'var(--gradient-button)',
            color: 'white',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Didn't receive the code?
        </p>
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-sm font-medium hover:underline disabled:opacity-50"
          style={{ color: 'var(--text-primary)' }}
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>

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

export default VerifyOtp;
