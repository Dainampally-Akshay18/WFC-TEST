/**
 * BLOG SEARCH
 * Debounced search component for blogs
 */

import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

export const BlogSearch = ({ onSearch, initialValue = "" }) => {
  const { colors } = useTheme();
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((value) => {
    setSearchValue(value);
    setIsSearching(!!value);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  const handleClear = () => {
    setSearchValue("");
    setIsSearching(false);
    onSearch("");
  };

  return (
    <div className="w-full">
      <div
        className="relative flex items-center rounded-lg px-4 py-3 transition-all duration-200"
        style={{
          background: `rgba(255,255,255,0.05)`,
          border: `1px solid ${colors.border.glass}`,
        }}
        onFocus={() => setIsSearching(true)}
        onBlur={() => !searchValue && setIsSearching(false)}
      >
        <Search className="h-5 w-5 flex-shrink-0" style={{ color: colors.text.muted }} />

        <input
          type="text"
          placeholder="Search blogs..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="ml-2 flex-1 bg-transparent outline-none"
          style={{ color: colors.text.primary }}
        />

        {searchValue && (
          <button
            onClick={handleClear}
            className="ml-2 rounded p-1 transition-colors duration-200"
            style={{ color: colors.text.muted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(255,255,255,0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogSearch;
