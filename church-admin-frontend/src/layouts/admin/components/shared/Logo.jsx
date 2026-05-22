const Logo = ({ collapsed = false }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Icon */}
      <div
        className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: 'var(--gradient-button)',
          boxShadow: 'var(--shadow-purple-glow)',
        }}
      >
        {/* Cross / church symbol */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2v20M2 9h20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        {/* Subtle glow ring */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
          }}
        />
      </div>

      {/* Text — hidden when collapsed */}
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span
            className="text-base font-bold tracking-tight"
            style={{
              background: 'var(--gradient-button)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Church Admin
          </span>
          <span
            className="text-[10px] font-medium tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Portal
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
