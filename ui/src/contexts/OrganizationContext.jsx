/**
 * Selected organization state.
 *
 * Shared across the organization-related scenes (details, representatives,
 * beneficial owners, submission). Cleared when the user navigates away.
 */
import { useCallback } from 'react';

import { createDomainContext } from './Context.jsx';
import { OrganizationProvider } from '../providers/OrganizationProvider.js';

const { Provider, useState, useUpdate } = createDomainContext('Organization', {
  current: null,
  loading: false,
  error: null,
});

export const OrganizationProviderContext = Provider;
export const useOrganizationState = useState;
export const useOrganizationUpdate = useUpdate;

export function useSelectedOrganization() {
  const state = useState();
  const { set } = useUpdate();

  const load = useCallback(
    async (organizationId) => {
      set({ loading: true, error: null });
      const res = await OrganizationProvider.get(organizationId);
      if (res.ok) {
        set({ current: res.result, loading: false });
        return res.result;
      }
      set({ current: null, loading: false, error: res.messages });
      return null;
    },
    [set],
  );

  const clear = useCallback(() => {
    set({ current: null, loading: false, error: null });
  }, [set]);

  return {
    organization: state.current,
    loading: state.loading,
    error: state.error,
    load,
    clear,
  };
}