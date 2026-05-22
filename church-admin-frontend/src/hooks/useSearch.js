import { useState } from 'react';
import { useDebounce } from './useDebounce';

export const useSearch = (initialValue = '', delay = 500) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const clearSearch = () => setSearchTerm('');

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    clearSearch,
  };
};
