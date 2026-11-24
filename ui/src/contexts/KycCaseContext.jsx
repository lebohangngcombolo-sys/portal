/**
 * Active KYC case state.
 *
 * Analysts switch between cases; the context keeps the currently-loaded
 * case plus its requirements so navigating between the case scenes
 * doesn't refetch on every route change.
 */
import { useCallback } from 'react';

import { createDomainContext } from './Context.jsx';
import { KycProvider } from '../providers/KycProvider.js';

const { Provider, useState, useUpdate } = createDomainContext('KycCase', {
  current: null,
  requirements: [],
  decisions: [],
  loading: false,
  error: null,
});

export const KycCaseProviderContext = Provider;
export const useKycCaseState = useState;
export const useKycCaseUpdate = useUpdate;

export function useSelectedKycCase() {
  const state = useState();
  const { set } = useUpdate();

  const load = useCallback(
    async (caseId) => {
      set({ loading: true, error: null });
      const [caseRes, reqRes, decRes] = await Promise.all([
        KycProvider.get(caseId),
        KycProvider.getRequirements(caseId),
        KycProvider.listDecisions(caseId),
      ]);
      if (!caseRes.ok) {
        set({ current: null, requirements: [], decisions: [], loading: false, error: caseRes.messages });
        return null;
      }
      set({
        current: caseRes.result,
        requirements: reqRes.ok ? reqRes.result : [],
        decisions: decRes.ok ? decRes.result : [],
        loading: false,
        error: null,
      });
      return caseRes.result;
    },
    [set],
  );

  const clear = useCallback(() => {
    set({ current: null, requirements: [], decisions: [], loading: false, error: null });
  }, [set]);

  return {
    kycCase: state.current,
    requirements: state.requirements,
    decisions: state.decisions,
    loading: state.loading,
    error: state.error,
    load,
    clear,
  };
}