/**
 * Aggregate ownership summary bar.
 *
 * Shows the aggregate percentage against the configured threshold.
 * Warns if the aggregate exceeds 100% or is below threshold without a
 * declaration.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useConfig } from '../../contexts/ConfigContext.jsx';
import { aggregateOwnership, exceedsAggregate } from '../../common/business/ownershipRules.js';
import { formatPercent } from '../../common/utils/currency.js';
import { Alert } from '../primitives/Alert.jsx';

export function OwnershipSummary({ owners = [] }) {
  const { t, i18n } = useTranslation();
  const config = useConfig();

  const threshold =
    config.countryConfiguration?.configuration?.['kyc.beneficial_ownership_threshold']
      ?.value ?? 25;
  const aggregate = aggregateOwnership(owners);
  const overLimit = exceedsAggregate(owners);
  const belowThreshold = aggregate < threshold;

  return (
    <Wrapper>
      <Stat>
        <Label>{t('organization.beneficialOwners.aggregate.label')}</Label>
        <Value>{formatPercent(aggregate, i18n.language)}</Value>
        <Meta>
          {t('organization.beneficialOwners.aggregate.threshold', {
            threshold: `${threshold}%`,
            defaultValue: 'Threshold: {{threshold}}',
          })}
        </Meta>
      </Stat>
      {overLimit && (
        <Alert variant="error">{t('organization.beneficialOwners.aggregate.warningOver')}</Alert>
      )}
      {!overLimit && belowThreshold && (
        <Alert variant="warning">
          {t('organization.beneficialOwners.aggregate.belowThreshold')}
        </Alert>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
`;

const Stat = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const Value = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #0b1220;
`;

const Meta = styled.span`
  font-size: 12px;
  color: #6b7280;
`;