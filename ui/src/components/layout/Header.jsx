/**
 * Global header — logo, notifications bell, user menu.
 *
 * In `minimal` mode (public pages) only the logo is shown.
 */
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ROUTES } from '../../common/constants/routes.js';
import { logoUrl } from '../../common/utils/assets.js';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '../primitives/Button.jsx';

export function Header({ minimal = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, fullName, email } = useSessionUser();
  const { unreadCount } = useNotifications();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <HeaderRoot>
      <Brand>
        <Link to={user ? ROUTES.DASHBOARD : ROUTES.ROOT}>
          <Logo src={logoUrl('logo-primary')} alt={t('app.name')} />
        </Link>
      </Brand>
      {!minimal && user && (
        <RightGroup>
          <Link to={ROUTES.ACCOUNT_NOTIFICATIONS}>
            <Bell title={t('navigation.notifications')}>
              {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
            </Bell>
          </Link>
          <UserMenu>
            <UserInfo title={email}>{fullName}</UserInfo>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              {t('common.logout')}
            </Button>
          </UserMenu>
        </RightGroup>
      )}
    </HeaderRoot>
  );
}

const HeaderRoot = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: #FFFFFF;
  border-bottom: 1px solid #E4E7EC;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  height: 40px;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Bell = styled.div`
  position: relative;
  font-size: 20px;
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -8px;
  background: #EF4444;
  color: #fff;
  border-radius: 999px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserInfo = styled.span`
  font-size: 14px;
  color: #0B1220;
`;