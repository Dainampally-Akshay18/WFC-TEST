const LoadingScreen = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Background blobs */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{
          background: 'var(--gradient-primary)',
          top: '20%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          animation: 'floatBlob 6s ease-in-out infinite',
        }}
      />

      <div className="relative text-center animate-fade-in-up">
        {/* Spinning ring */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid var(--border-soft)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid transparent',
              borderTopColor: 'rgba(123, 44, 191, 0.8)',
              borderRightColor: 'rgba(199, 125, 255, 0.4)',
              animation: 'spinRing 1.2s linear infinite',
            }}
          />

          {/* Logo inside spinner */}
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--gradient-button)',
              boxShadow: 'var(--shadow-purple-glow)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M2 9h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <p
          className="text-sm font-medium tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
