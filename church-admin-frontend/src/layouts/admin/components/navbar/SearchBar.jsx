import { useState } from 'react';

const SearchBar = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="flex-1 max-w-md">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-lg"
        style={{
          background: 'var(--glass-card)',
          border: '1px solid var(--border-input)',
          color: 'var(--text-primary)',
        }}
      />
    </div>
  );
};

export default SearchBar;
