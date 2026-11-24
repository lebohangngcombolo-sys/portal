import styled from 'styled-components';

export function Stepper({ steps = [], current = 0, className }) {
  return (
    <Wrapper className={className}>
      {steps.map((label, i) => (
        <Step key={i} active={i === current} done={i < current}>
          <Bullet active={i === current} done={i < current}>
            {i < current ? '✓' : i + 1}
          </Bullet>
          <Label active={i === current} done={i < current}>
            {label}
          </Label>
          {i < steps.length - 1 && <Connector done={i < current} />}
        </Step>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Bullet = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: ${({ active, done }) =>
    done ? '#0b5fff' : active ? '#eef3ff' : '#f3f4f6'};
  color: ${({ active, done }) =>
    done ? '#ffffff' : active ? '#0b5fff' : '#6b7280'};
  border: 2px solid ${({ active, done }) =>
    done ? '#0b5fff' : active ? '#0b5fff' : '#e5e7eb'};
`;

const Label = styled.span`
  font-size: 13px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active, done }) => (done || active ? '#0b1220' : '#6b7280')};
`;

const Connector = styled.div`
  width: 32px;
  height: 2px;
  margin: 0 12px;
  background: ${({ done }) => (done ? '#0b5fff' : '#e5e7eb')};
`;