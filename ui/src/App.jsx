import { BrowserRouter } from 'react-router-dom';

import { ContextProviders } from './contexts/ContextProviders.jsx';
import { Router } from './routes/Router.jsx';
import { ErrorBoundary } from './components/feedback/ErrorBoundary.jsx';
import { ToastHost } from './components/feedback/ToastHost.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { GlobalStyles } from './styles/GlobalStyles.jsx';

/**
 * Root application component.
 *
 * Structure:
 *   ErrorBoundary → ContextProviders → BrowserRouter → AppShell → Router
 *
 * - ErrorBoundary catches uncaught render errors and shows a fallback.
 * - ContextProviders sets up every domain context (Auth, Config, User,
 *   Form, Notification, etc.).
 * - BrowserRouter is inside providers so contexts can navigate.
 * - AppShell renders header/sidebar/footer around the routed scene.
 * - Router is the last piece; every scene renders inside the shell.
 */
export function App({ initialConfig }) {
  return (
    <ErrorBoundary>
      <GlobalStyles />
      <ContextProviders initialConfig={initialConfig}>
        <BrowserRouter>
          <AppShell>
            <Router />
          </AppShell>
          <ToastHost />
        </BrowserRouter>
      </ContextProviders>
    </ErrorBoundary>
  );
}