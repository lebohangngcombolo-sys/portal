/**
 * Global footer — legal links and copyright.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useConfig } from '../../contexts/ConfigContext.jsx';

export function Footer({ minimal = false }) {
  const { t } = useTranslation();
  const config = useConfig();
  const year = new Date().getFullYear();
  const country = config.activeCountryCode?.toLowerCase() || 'za';

  return (
    <FooterRoot>
      {!minimal && (
        <Links>
          <a href={`/legal/terms-${country}.md`} target="_blank" rel="noopener noreferrer">
            {t('footer.terms')}
          </a>
          <a href={`/legal/privacy-${country}.md`} target="_blank" rel="noopener noreferrer">
            {t('footer.privacy')}
          </a>
        </Links>
      )}
      <Copyright>{t('footer.copyright', { year })}</Copyright>
    </FooterRoot>
  );
}

const FooterRoot = styled.footer`
  grid-area: footer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #FFFFFF;
  border-top: 1px solid #E4E7EC;
  font-size: 12px;
  color: #6B7280;
`;

const Links = styled.div`
  display: flex;
  gap: 16px;

  a {
    color: #6B7280;
    text-decoration: none;

    &:hover {
      color: #0B5FFF;
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.span``;