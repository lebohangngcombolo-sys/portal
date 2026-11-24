import styled from 'styled-components';

export function Card({ title, actions, children, className }) {
  return (
    <StyledCard className={className}>
      {(title || actions) && (
        <Header>
          {title && <Title>{title}</Title>}
          {actions && <Actions>{actions}</Actions>}
        </Header>
      )}
      <Body>{children}</Body>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  background: #ffffff;
  border: 1px solid #e4e7ec;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0b1220;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Body = styled.div``;