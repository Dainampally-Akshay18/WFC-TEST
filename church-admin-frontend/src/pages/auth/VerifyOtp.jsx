import { useState } from 'react';
import AuthLogo from '../../layouts/auth/components/AuthLogo';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Verify OTP:', otp);
  };

  return (
    <div>
      <AuthLogo />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-2 rounded-lg text-center text-2xl tracking-widest"
            style={{
              background: 'var(--glass-card)',
              border: '1px solid var(--border-input)',
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg font-medium"
          style={{
            background: 'var(--gradient-button)',
            color: 'white',
          }}
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
