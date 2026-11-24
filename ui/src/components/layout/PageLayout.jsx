/**
 * Standard scene layout: title + subtitle + actions slot + body.
 *
 * Every scene wraps its content in <PageLayout>. It provides consistent
 * spacing, the page heading, and the action buttons row. It relies on
 * AppShell for the actual chrome (header, sidebar, footer).
 */
import styled from 'styled-components';

export function PageLayout({ title, subtitle, actions, children, className }) {
  return (
    <LayoutRoot className={className}>
      {(title || actions) && (
        <Header>
          <TitleBlock>
            {title && <Title>{title}</Title>}
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleBlock>
          {actions && <Actions>{actions}</Actions>}
        </Header>
      )}
      <Body>{children}</Body>
    </LayoutRoot>
  );
}

const LayoutRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || '#0B1220'};
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme?.colors?.textMuted || '#5B6473'};
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;