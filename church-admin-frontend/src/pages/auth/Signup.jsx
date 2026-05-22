import { useState } from 'react';
import AuthLogo from '../../layouts/auth/components/AuthLogo';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup:', formData);
  };

  return (
    <div>
      <AuthLogo />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg"
              style={{
                background: 'var(--glass-card)',
                border: '1px solid var(--border-input)',
              }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg"
              style={{
                background: 'var(--glass-card)',
                border: '1px solid var(--border-input)',
              }}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg"
            style={{
              background: 'var(--glass-card)',
              border: '1px solid var(--border-input)',
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
