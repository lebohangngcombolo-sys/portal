import styled from 'styled-components';

export function EmptyState({ title, description, action, className }) {
  return (
    <Wrapper className={className}>
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {action && <Action>{action}</Action>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0b1220;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  max-width: 480px;
`;

const Action = styled.div`
  margin-top: 8px;
`;