const AuthBackground = ({ children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--gradient-primary)',
      }}
    >
      {children}
    </div>
  );
};

export default AuthBackground;
