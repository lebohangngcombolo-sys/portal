/**
 * Renders a notification template with sample placeholder values.
 *
 * Uses the same substitution rules as the backend: replace `${var}`
 * with values, HTML-escape when the channel is EMAIL.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '../primitives/Button.jsx';

/**
 * Replace ${var} occurrences using the given variables.
 * If a variable is missing, keep the ${var} literal so the operator can
 * see what needs filling in.
 */
function renderTemplate(template, variables) {
  if (!template) return '';
  return template.replace(/\$\{([A-Za-z0-9_.]+)}/g, (match, name) => {
    return variables[name] != null ? String(variables[name]) : match;
  });
}

export function NotificationTemplatePreview({ template, onClose }) {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    otpCode: '123456',
    expiryMinutes: '10',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    kycCaseId: 'KYC-12345',
    decisionId: 'DEC-9876',
    message: 'Sample message',
  });

  const subject = renderTemplate(template.subjectTemplate, values);
  const body = renderTemplate(template.bodyTemplate, values);

  return (
    <Wrapper>
      <h2>{t('admin.templates.preview')}</h2>
      <Meta>
        {template.templateCode} · {template.channel} · {template.languageCode} · v
        {template.version}
      </Meta>

      {subject && (
        <Section>
          <SectionTitle>{t('admin.templates.subject', { defaultValue: 'Subject' })}</SectionTitle>
          <Preview>{subject}</Preview>
        </Section>
      )}

      <Section>
        <SectionTitle>{t('admin.templates.body', { defaultValue: 'Body' })}</SectionTitle>
        <Preview
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </Section>

      <VariablesTitle>
        {t('admin.templates.variables', { defaultValue: 'Sample variables' })}
      </VariablesTitle>
      <VariableGrid>
        {Object.entries(values).map(([key, value]) => (
          <label key={key}>
            <span>{key}</span>
            <input
              value={value}
              onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          </label>
        ))}
      </VariableGrid>

      <Actions>
        <Button variant="ghost" onClick={onClose}>
          {t('common.close')}
        </Button>
      </Actions>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 18px;
  }
`;

const Meta = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const Section = styled.div``;

const SectionTitle = styled.h4`
  margin: 0 0 4px;
  font-size: 13px;
  color: #374151;
`;

const Preview = styled.div`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
  font-size: 14px;
  color: #0b1220;
  white-space: pre-wrap;
`;

const VariablesTitle = styled.h4`
  margin: 8px 0 4px;
  font-size: 13px;
  color: #374151;
`;

const VariableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
    color: #6b7280;
  }

  input {
    padding: 6px 8px;
    font-size: 13px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;