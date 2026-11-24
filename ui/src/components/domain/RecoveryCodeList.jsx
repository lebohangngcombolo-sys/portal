/**
 * One-time display of recovery codes. Includes a "download as .txt"
 * button (client-side) so the user can save them safely.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '../primitives/Button.jsx';

export function RecoveryCodeList({ codes = [] }) {
  const { t } = useTranslation();

  const handleDownload = () => {
    const text = codes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tradebridge-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Wrapper>
      <Grid>
        {codes.map((code) => (
          <Code key={code}>{code}</Code>
        ))}
      </Grid>
      <Button variant="ghost" onClick={handleDownload}>
        {t('account.security.mfa.setup.recoveryCodes.download', { defaultValue: 'Download codes' })}
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
`;

const Grid = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 480px;
`;

const Code = styled.li`
  font-family: monospace;
  font-size: 14px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 4px;
  text-align: center;
  letter-spacing: 1px;
`;