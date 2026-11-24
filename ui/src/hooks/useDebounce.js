/**
 * Debounce a value. Returns the debounced value, which updates only after
 * `delayMs` has elapsed without changes.
 *
 * Common use: debouncing search inputs before firing a network request.
 */

import { useEffect, useState } from 'react';

export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}