/**
 * Application shell — chrome around every routed scene.
 *
 * Renders:
 * - Header (logo, nav, notifications bell, user menu)
 * - Sidebar (role-driven nav) on >= md screens
 * - Footer
 * - Main content area (children = routed scene)
 * - ModalHost (renders modals opened via useModal)
 *
 * Public routes (login, register, etc.) bypass the sidebar but keep the
 * header/footer. Detection is based on the current path — the scene
 * registry marks which routes are public.
 */
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { Footer } from './Footer.jsx';
import { ModalHost } from '../feedback/ModalHost.jsx';
import { isPublicPath } from '../../routes/public.js';

export function AppShell({ children }) {
  const location = useLocation();
  const isPublic = isPublicPath(location.pathname);

  if (isPublic) {
    return (
      <PublicShell>
        <Header minimal />
        <Main>{children}</Main>
        <Footer minimal />
        <ModalHost />
      </PublicShell>
    );
  }

  return (
    <AppGrid>
      <Header />
      <Sidebar />
      <Main>
        <MainInner>{children}</MainInner>
      </Main>
      <Footer />
      <ModalHost />
    </AppGrid>
  );
}

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 56px 1fr auto;
  grid-template-areas:
    'header header'
    'sidebar main'
    'sidebar footer';
  min-height: 100vh;
  background: ${({ theme }) => theme?.colors?.bg || '#F7F8FA'};
`;

const PublicShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme?.colors?.bg || '#F7F8FA'};
`;

const Main = styled.main`
  grid-area: main;
  overflow-x: hidden;
`;

const MainInner = styled.div`
  min-height: calc(100vh - 56px);
`;