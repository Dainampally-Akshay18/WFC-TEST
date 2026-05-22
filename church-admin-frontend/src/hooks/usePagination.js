import { useState } from 'react';
import { PAGINATION } from '../constants/appConstants';

export const usePagination = (initialPage = PAGINATION.DEFAULT_PAGE, initialLimit = PAGINATION.DEFAULT_LIMIT) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToPage = (pageNumber) => setPage(pageNumber);
  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const reset = () => {
    setPage(initialPage);
    setLimit(initialLimit);
  };

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
  };
};
