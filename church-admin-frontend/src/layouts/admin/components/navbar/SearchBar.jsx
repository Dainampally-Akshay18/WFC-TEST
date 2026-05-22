import { useState } from 'react';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative flex-1 max-w-xs">
      {/* Search icon */}
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-9 pr-4 py-2 rounded-xl text-sm transition-all duration-300"
        style={{
          background: focused ? 'var(--glass-card)' : 'var(--glass-card)',
          border: `1px solid ${focused ? 'rgba(123, 44, 191, 0.4)' : 'var(--border-input)'}`,
          color: 'var(--text-primary)',
          boxShadow: focused ? '0 0 0 3px rgba(123, 44, 191, 0.1)' : 'none',
          backdropFilter: 'blur(8px)',
          outline: 'none',
        }}
      />
    </div>
  );
};

export default SearchBar;
