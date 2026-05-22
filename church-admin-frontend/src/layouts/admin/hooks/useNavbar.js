import { useState } from 'react';

export const useNavbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => setSearchOpen(!searchOpen);
  const closeSearch = () => setSearchOpen(false);

  return {
    searchOpen,
    toggleSearch,
    closeSearch,
  };
};
