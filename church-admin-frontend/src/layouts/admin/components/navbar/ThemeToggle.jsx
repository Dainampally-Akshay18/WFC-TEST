import { useTheme } from '../../../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 group"
      style={{
        background: 'var(--glass-card)',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-small)',
      }}
    >
      {/* Sun icon */}
      <span
        className="relative z-10 w-7 h-7 flex items-center justify-center rounded-lg text-base transition-all duration-300"
        style={{
          background: !isDark ? 'var(--gradient-button)' : 'transparent',
          color: !isDark ? 'white' : 'var(--text-muted)',
          boxShadow: !isDark ? 'var(--shadow-small)' : 'none',
        }}
      >
        ☀️
      </span>

      {/* Moon icon */}
      <span
        className="relative z-10 w-7 h-7 flex items-center justify-center rounded-lg text-base transition-all duration-300"
        style={{
          background: isDark ? 'var(--gradient-button)' : 'transparent',
          color: isDark ? 'white' : 'var(--text-muted)',
          boxShadow: isDark ? 'var(--shadow-small)' : 'none',
        }}
      >
        🌙
      </span>
    </button>
  );
};

export default ThemeToggle;
