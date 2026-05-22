import { useState } from 'react';
import AuthLogo from '../../layouts/auth/components/AuthLogo';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password');
  };

  return (
    <div>
      <AuthLogo />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg"
            style={{
              background: 'var(--glass-card)',
              border: '1px solid var(--border-input)',
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg"
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
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
