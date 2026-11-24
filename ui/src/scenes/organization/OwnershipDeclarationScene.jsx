/**
 * Ownership declaration scene — submit the declaration that accompanies
 * the beneficial ownership records.
 *
 * The declaration is required when the aggregate ownership is below the
 * configured threshold ("no beneficial owners above threshold") OR always
 * required by the backend's KYC case submission flow. This scene handles
 * both cases:
 * - Below threshold: checkbox must be ticked.
 * - At or above threshold: declaration text is required.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedOrganization } from '../../contexts/OrganizationContext.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useConfig } from '../../contexts/ConfigContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { BeneficialOwnerProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { TextArea } from '../../components/primitives/Textarea.jsx';
import { Checkbox } from '../../components/primitives/Checkbox.jsx';
import { OwnershipSummary } from '../../components/domain/OwnershipSummary.jsx';
import { aggregateOwnership } from '../../common/business/ownershipRules.js';

export default function OwnershipDeclarationScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const config = useConfig();
  const { organization, load } = useSelectedOrganization();

  const [declaration, setDeclaration] = useState('');
  const [confirmNoOwners, setConfirmNoOwners] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: owners, loading } = useProviderFetch(
    () => BeneficialOwnerProvider.list(id),
    { enabled: Boolean(id), deps: [id] },
  );

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  const threshold =
    config.countryConfiguration?.configuration?.['kyc.beneficial_ownership_threshold']?.value ??
    25;
  const aggregate = aggregateOwnership(owners || []);
  const belowThreshold = aggregate < threshold;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await BeneficialOwnerProvider.submitDeclaration(id, {
        declaration,
        noBeneficialOwnersAboveThreshold: belowThreshold ? confirmNoOwners : false,
      });
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Failed');
        return;
      }
      toast.success(t('organization.beneficialOwners.declaration.submitted', {
        defaultValue: 'Declaration submitted',
      }));
      navigate(routeBuilders.organizationDetail(id));
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    declaration.trim().length > 0 && (!belowThreshold || confirmNoOwners);

  return (
    <PageLayout
      title={t('organization.beneficialOwners.declaration.title')}
      subtitle={organization?.legalName}
    >
      <Card>
        {loading && <Spinner />}
        <OwnershipSummary owners={owners || []} />
        {belowThreshold && (
          <p className="hint">{t('organization.beneficialOwners.aggregate.belowThreshold')}</p>
        )}
        <TextArea
          label={t('organization.beneficialOwners.declaration.body')}
          value={declaration}
          onChange={(e) => setDeclaration(e.target.value)}
          rows={4}
          maxLength={500}
          required
        />
        {belowThreshold && (
          <Checkbox
            label={t('organization.beneficialOwners.declaration.confirmNoOwners')}
            checked={confirmNoOwners}
            onChange={setConfirmNoOwners}
          />
        )}
        <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit || submitting}>
          {submitting
            ? t('common.submitting')
            : t('organization.beneficialOwners.declaration.submit')}
        </Button>
      </Card>
    </PageLayout>
  );
}