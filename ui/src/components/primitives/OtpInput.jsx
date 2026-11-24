/**
 * OTP input — 6 boxed digits, auto-advance, backspace-aware.
 *
 * Supports `allowRecoveryCode` mode, in which the input falls back to a
 * plain text field accepting XXXXXXXX-XXXXXXXX.
 */
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export function OtpInput({
  label,
  length = 6,
  value = '',
  onChange,
  error,
  allowRecoveryCode = false,
  className,
}) {
  const [digits, setDigits] = useState(() => (value || '').padEnd(length, ' ').split('').slice(0, length));
  const [mode, setMode] = useState('otp'); // 'otp' | 'recovery'
  const refs = useRef([]);

  useEffect(() => {
    setDigits((value || '').padEnd(length, ' ').split('').slice(0, length));
  }, [value, length]);

  const emit = (next) => {
    const joined = next.join('').replace(/\s/g, '');
    onChange?.(joined);
  };

  const handleDigit = (i, char) => {
    if (!/^\d?$/.test(char)) return;
    const next = [...digits];
    next[i] = char || ' ';
    setDigits(next);
    emit(next);
    if (char && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i]?.trim() && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\s/g, '').slice(0, length);
    const next = text.padEnd(length, ' ').split('');
    setDigits(next);
    emit(next);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <Wrapper className={className}>
      {label && <Label>{label}</Label>}
      {mode === 'otp' && (
        <Row onPaste={handlePaste}>
          {digits.map((d, i) => (
            <Digit
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d.trim()}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              error={Boolean(error)}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </Row>
      )}
      {mode === 'recovery' && (
        <RecoveryInput
          type="text"
          placeholder="XXXXXXXX-XXXXXXXX"
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value.toUpperCase())}
        />
      )}
      {error && <ErrorText>{error}</ErrorText>}
      {allowRecoveryCode && (
        <Toggle
          type="button"
          onClick={() => {
            setMode(mode === 'otp' ? 'recovery' : 'otp');
            onChange?.('');
          }}
        >
          {mode === 'otp' ? 'Use a recovery code instead' : 'Use authenticator code instead'}
        </Toggle>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const Digit = styled.input`
  width: 44px;
  height: 52px;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  border: 1px solid ${({ error }) => (error ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #0b5fff;
    box-shadow: 0 0 0 3px rgba(11, 95, 255, 0.1);
  }
`;

const RecoveryInput = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  font-family: monospace;
  letter-spacing: 1px;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

const Toggle = styled.button`
  align-self: flex-start;
  background: transparent;
  border: none;
  color: #0b5fff;
  font-size: 13px;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
`;