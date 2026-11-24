/**
 * Role-aware sidebar navigation.
 *
 * The navigation items are gated by permissions — an analyst sees
 * KYC Cases; an admin sees Users/Templates; a super-admin sees Countries.
 */
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ROUTES } from '../../common/constants/routes.js';
import { usePermissions } from '../../hooks/usePermissions.js';

export function Sidebar() {
  const { t } = useTranslation();
  const { isStaff, isAdmin, isSuperAdmin, isKycAnalyst } = usePermissions();

  const items = [
    { to: ROUTES.DASHBOARD, label: t('navigation.dashboard'), always: true },
    { to: ROUTES.ORGANIZATIONS, label: t('navigation.organizations') },
    { to: ROUTES.ACCOUNT_NOTIFICATIONS, label: t('navigation.notifications') },
    { to: ROUTES.ACCOUNT_PROFILE, label: t('navigation.profile'), always: true },
    { to: ROUTES.ACCOUNT_SECURITY, label: t('navigation.security'), always: true },
  ];

  if (isKycAnalyst) {
    items.splice(2, 0, { to: ROUTES.KYC_CASES, label: t('navigation.kycCases') });
  }
  if (isAdmin) {
    items.push({ to: ROUTES.ADMIN_USERS, label: t('navigation.users') });
    items.push({ to: ROUTES.ADMIN_ROLES, label: t('navigation.roles') });
    items.push({ to: ROUTES.ADMIN_TEMPLATES, label: t('navigation.templates') });
    items.push({ to: ROUTES.ADMIN_DELIVERIES, label: t('navigation.deliveries') });
  }
  if (isSuperAdmin) {
    items.push({ to: ROUTES.ADMIN_COUNTRIES, label: t('navigation.countries') });
  }

  return (
    <SidebarRoot>
      <Nav>
        {items.map((item) => (
          <Item key={item.to}>
            <NavLink to={item.to} end>
              {({ isActive }) => (
                <NavItem active={isActive}>{item.label}</NavItem>
              )}
            </NavLink>
          </Item>
        ))}
      </Nav>
    </SidebarRoot>
  );
}

const SidebarRoot = styled.aside`
  grid-area: sidebar;
  background: #FFFFFF;
  border-right: 1px solid #E4E7EC;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
`;

const Nav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Item = styled.li`
  a {
    text-decoration: none;
  }
`;

const NavItem = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: ${({ active }) => (active ? '#0B5FFF' : '#374151')};
  background: ${({ active }) => (active ? '#EEF3FF' : 'transparent')};
  font-weight: ${({ active }) => (active ? 600 : 400)};

  &:hover {
    background: ${({ active }) => (active ? '#EEF3FF' : '#F3F4F6')};
  }
`;