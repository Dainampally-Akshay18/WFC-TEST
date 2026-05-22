import { useState } from 'react';
import AuthLogo from '../../layouts/auth/components/AuthLogo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Forgot password:', email);
  };

  return (
    <div>
      <AuthLogo />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
