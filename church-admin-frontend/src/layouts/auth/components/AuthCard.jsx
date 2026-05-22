const AuthCard = ({ children }) => {
  return (
    <div
      className="w-full max-w-md p-8 rounded-2xl"
      style={{
        background: 'var(--glass-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-glass)',
      }}
    >
      {children}
    </div>
  );
};

export default AuthCard;
