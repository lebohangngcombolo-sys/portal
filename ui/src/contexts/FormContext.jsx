/**
 * Cross-route form state.
 *
 * Used for multi-step flows (e.g. organization onboarding) where each step
 * is a separate scene. Scenes read/write through this context so the user
 * can go back and forth without losing progress.
 *
 * Each form has an id (a stable string). Values are isolated per id so
 * multiple forms can coexist.
 */
import { useCallback, useMemo } from 'react';

import { createDomainContext } from './Context.jsx';

const { Provider, useState, useUpdate } = createDomainContext('Form', {
  forms: {}, // { [formId]: { values, dirty } }
});

export const FormProvider = Provider;
export const useFormStateContext = useState;
export const useFormUpdateContext = useUpdate;

export function useSharedForm(formId, initialValues = {}) {
  const state = useState();
  const { set } = useUpdate();

  const entry = state.forms[formId];
  const values = entry?.values ?? initialValues;
  const dirty = entry?.dirty ?? false;

  const setValues = useCallback(
    (next) => {
      set((prev) => ({
        forms: {
          ...prev.forms,
          [formId]: {
            values: typeof next === 'function' ? next(prev.forms[formId]?.values ?? initialValues) : next,
            dirty: true,
          },
        },
      }));
    },
    [formId, initialValues, set],
  );

  const reset = useCallback(() => {
    set((prev) => {
      const forms = { ...prev.forms };
      delete forms[formId];
      return { forms };
    });
  }, [formId, set]);

  const patch = useCallback(
    (partialValues) => {
      setValues((current) => ({ ...current, ...partialValues }));
    },
    [setValues],
  );

  return useMemo(
    () => ({ values, dirty, setValues, patch, reset }),
    [values, dirty, setValues, patch, reset],
  );
}