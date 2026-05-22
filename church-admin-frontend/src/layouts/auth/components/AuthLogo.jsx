const AuthLogo = () => {
  return (
    <div className="text-center mb-8">
      <div
        className="relative w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
        style={{
          background: 'var(--gradient-button)',
          boxShadow: 'var(--shadow-purple-glow)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v20M2 9h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
        />
      </div>

      <h1
        className="text-2xl font-bold tracking-tight"
        style={{
          background: 'var(--gradient-button)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Church Admin
      </h1>
      <p
        className="text-xs font-medium tracking-widest uppercase mt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        Portal
      </p>
    </div>
  );
};

export default AuthLogo;
