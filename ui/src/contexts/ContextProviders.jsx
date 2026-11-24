/**
 * Root context aggregator.
 *
 * Wraps the app in every domain context provider in dependency order:
 * 1. Config (from bootstrap bundle — needed by everyone)
 * 2. Toast / Modal (UI infra — needed by scenes)
 * 3. User (seeded empty — filled by Auth)
 * 4. Auth (wraps User — fetches user on mount)
 * 5. Form / Organization / KycCase / Notification (feature-level)
 */
import { useMemo } from 'react';

import { ConfigProvider } from './ConfigContext.jsx';
import { ToastProvider } from './ToastContext.jsx';
import { ModalProvider } from './ModalContext.jsx';
import { UserProvider } from './UserContext.jsx';
import { AuthContextProvider } from './AuthContext.jsx';
import { FormProvider } from './FormContext.jsx';
import { OrganizationProviderContext } from './OrganizationContext.jsx';
import { KycCaseProviderContext } from './KycCaseContext.jsx';
import { NotificationProviderContext } from './NotificationContext.jsx';

export function ContextProviders({ initialConfig, children }) {
  const configOverrides = useMemo(
    () => ({
      countries: initialConfig?.countries ?? [],
      languages: initialConfig?.languages ?? [],
      activeCountryCode: initialConfig?.activeCountryCode ?? null,
      countryConfiguration: initialConfig?.countryConfiguration ?? null,
      countryKycRequirements: initialConfig?.countryKycRequirements ?? null,
      countryOrganizationRequirements: initialConfig?.countryOrganizationRequirements ?? null,
      errors: initialConfig?.errors ?? [],
      loaded: true,
    }),
    [initialConfig],
  );

  return (
    <ConfigProvider initialOverrides={configOverrides}>
      <ToastProvider>
        <ModalProvider>
          <UserProvider>
            <AuthContextProvider>
              <NotificationProviderContext>
                <FormProvider>
                  <OrganizationProviderContext>
                    <KycCaseProviderContext>{children}</KycCaseProviderContext>
                  </OrganizationProviderContext>
                </FormProvider>
              </NotificationProviderContext>
            </AuthContextProvider>
          </UserProvider>
        </ModalProvider>
      </ToastProvider>
    </ConfigProvider>
  );
}