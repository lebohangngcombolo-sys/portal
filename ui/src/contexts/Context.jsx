/**
 * Context factory.
 *
 * Creates a paired (state, update) context for a domain:
 * - `XStateContext` — read-only value (memoized object)
 * - `XUpdateContext` — setter functions (stable across renders)
 * - `XProvider` — component that wraps both
 * - `useXState()` / `useXUpdate()` — consumer hooks
 *
 * Update functions are stabilized with `useCallback`; the state object is
 * memoized with `useMemo`. Consumers that only read state re-render on state
 * changes; consumers that only use update functions never re-render because
 * of this context.
 *
 * @param {string} name — e.g. 'User', 'Auth', 'Config'
 * @param {object} initialState
 * @returns {{
 *   Provider: React.FC,
 *   useState: () => object,
 *   useUpdate: () => object,
 *   StateContext: React.Context,
 *   UpdateContext: React.Context,
 * }}
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export function createDomainContext(name, initialState) {
  const StateContext = createContext(null);
  const UpdateContext = createContext(null);
  StateContext.displayName = `${name}StateContext`;
  UpdateContext.displayName = `${name}UpdateContext`;

  function Provider({ children, initialOverrides = null }) {
    const [state, setState] = useState(() => ({
      ...initialState,
      ...(initialOverrides || {}),
    }));

    // Stable refs so update helpers never trigger re-renders of their consumers
    const ref = useRef(state);
    ref.current = state;

    // ---------------------------------------------------------- update helpers

    const set = useCallback((patch) => {
      setState((prev) => (typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }));
    }, []);

    const reset = useCallback(() => {
      setState({ ...initialState, ...(initialOverrides || {}) });
    }, [initialOverrides]);

    const pick = useCallback((keys) => {
      const snapshot = {};
      keys.forEach((k) => {
        snapshot[k] = ref.current[k];
      });
      return snapshot;
    }, []);

    // ---------------------------------------------------------- memoized values

    const stateValue = useMemo(() => state, [state]);

    const updateValue = useMemo(
      () => ({
        set,
        reset,
        pick,
        get: () => ref.current,
      }),
      [set, reset, pick],
    );

    return (
      <StateContext.Provider value={stateValue}>
        <UpdateContext.Provider value={updateValue}>{children}</UpdateContext.Provider>
      </StateContext.Provider>
    );
  }

  function useStateHook() {
    const ctx = useContext(StateContext);
    if (ctx === null) {
      throw new Error(`use${name}State must be used within <${name}Provider>`);
    }
    return ctx;
  }

  function useUpdateHook() {
    const ctx = useContext(UpdateContext);
    if (ctx === null) {
      throw new Error(`use${name}Update must be used within <${name}Provider>`);
    }
    return ctx;
  }

  return {
    Provider,
    useState: useStateHook,
    useUpdate: useUpdateHook,
    StateContext,
    UpdateContext,
  };
}