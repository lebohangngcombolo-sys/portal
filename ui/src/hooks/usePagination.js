/**
 * Pagination state for list views.
 *
 * Usage:
 *   const pagination = usePagination({ page: 0, size: 20 });
 *   // pagination.page, pagination.size, pagination.setPage(n), pagination.setSize(n), pagination.reset()
 */

import { useCallback, useState } from 'react';

export function usePagination({ page = 0, size = 20 } = {}) {
  const [state, setState] = useState({ page, size });

  const setPage = useCallback((nextPage) => {
    setState((prev) => ({ ...prev, page: Math.max(0, nextPage) }));
  }, []);

  const setSize = useCallback((nextSize) => {
    setState((prev) => ({ ...prev, size: Math.max(1, nextSize), page: 0 }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prev = useCallback(() => {
    setState((s) => ({ ...s, page: Math.max(0, s.page - 1) }));
  }, []);

  const reset = useCallback(() => {
    setState({ page: 0, size });
  }, [size]);

  return {
    page: state.page,
    size: state.size,
    setPage,
    setSize,
    next,
    prev,
    reset,
    params: { page: state.page, size: state.size },
  };
}