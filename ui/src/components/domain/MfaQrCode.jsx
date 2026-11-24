/**
 * QR code + manual secret for MFA setup.
 *
 * Renders the provisioning URI as a scannable QR using `qrcode.react`,
 * which emits an inline SVG (no raster canvas). The manual secret is
 * always shown below the QR so the user can enter it in their app if
 * scanning isn't convenient.
 */
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';

export function MfaQrCode({ uri, secret }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <QrHolder>
        <QRCodeSVG
          value={uri || ''}
          size={180}
          level="M" // ~15% error correction — matches most TOTP setups
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#0b1220"
          title={t('account.security.mfa.setup.title')}
        />
      </QrHolder>
      <Info>
        <p>{t('account.security.mfa.setup.manualEntry')}</p>
        <Secret>{secret}</Secret>
      </Info>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
`;

const QrHolder = styled.div`
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Info = styled.div`
  text-align: center;
  font-size: 14px;
  color: #374151;
`;

const Secret = styled.code`
  display: block;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  letter-spacing: 1px;
  word-break: break-all;
`;