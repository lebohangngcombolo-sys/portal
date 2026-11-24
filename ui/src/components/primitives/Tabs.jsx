import styled from 'styled-components';

export function Tabs({ tabs = [], active, onChange, className }) {
  return (
    <TabList role="tablist" className={className}>
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          role="tab"
          type="button"
          active={active === tab.value}
          onClick={() => onChange?.(tab.value)}
        >
          {tab.label}
        </Tab>
      ))}
    </TabList>
  );
}

const TabList = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active }) => (active ? '#0b5fff' : '#6b7280')};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ active }) => (active ? '#0b5fff' : 'transparent')};
  cursor: pointer;
  margin-bottom: -1px;

  &:hover {
    color: #0b5fff;
  }
`;