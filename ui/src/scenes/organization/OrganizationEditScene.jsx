/**
 * Organization edit scene — updates core fields.
 *
 * Only certain statuses permit editing (DRAFT, WITHDRAWN). If the
 * organization is not editable, the scene renders a message and a link
 * back to the detail scene.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { ORGANIZATION_EDITABLE_STATUSES } from '../../common/constants/kycStatus.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedOrganization } from '../../contexts/OrganizationContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { OrganizationProvider } from '../../providers/index.js';
import { useForm } from '../../hooks/useForm.js';
import { companyOnboardingSchema } from '../../forms/configuration/validation.js';
import { CompanyDetailsSection } from '../../forms/sections/CompanyDetailsSection.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';

export default function OrganizationEditScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { organization, loading, load } = useSelectedOrganization();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  const form = useForm({
    initialValues: {
      legalName: '',
      tradingName: '',
      organizationType: '',
      businessDescription: '',
      website: '',
      registrationNumber: '',
      taxNumber: '',
      incorporationDate: '',
      registrationAuthority: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      region: '',
      postalCode: '',
      addressCountryCode: '',
    },
    validationSchema: companyOnboardingSchema,
    onSubmit: async (values) => {
      const res = await OrganizationProvider.update(id, {
        legalName: values.legalName,
        tradingName: values.tradingName,
        taxNumber: values.taxNumber,
        incorporationDate: values.incorporationDate,
        registrationAuthority: values.registrationAuthority,
        businessDescription: values.businessDescription,
        website: values.website,
      });
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Update failed');
        return { ok: false };
      }
      toast.success(t('common.save'));
      navigate(routeBuilders.organizationDetail(id));
      return { ok: true };
    },
  });

  // Populate the form once when organization loads
  useEffect(() => {
    if (organization && !initialized) {
      form.resetForm({
        legalName: organization.legalName || '',
        tradingName: organization.tradingName || '',
        organizationType: organization.organizationType || '',
        businessDescription: organization.businessDescription || '',
        website: organization.website || '',
        registrationNumber: organization.registrationNumber || '',
        taxNumber: organization.taxNumber || '',
        incorporationDate: organization.incorporationDate || '',
        registrationAuthority: organization.registrationAuthority || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        region: '',
        postalCode: '',
        addressCountryCode: organization.countryCode || '',
      });
      setInitialized(true);
    }
  }, [organization, initialized, form]);

  if (loading || !organization) {
    return <PageLayout><Spinner /></PageLayout>;
  }

  if (!ORGANIZATION_EDITABLE_STATUSES.includes(organization.status)) {
    return (
      <PageLayout title={t('organization.create.title')}>
        <Card>
          <p>
            {t('organization.edit.notAllowed', {
              defaultValue: 'This organization cannot be edited in its current status.',
            })}
          </p>
          <Link to={routeBuilders.organizationDetail(id)}>
            <Button variant="ghost">{t('common.back')}</Button>
          </Link>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={t('organization.create.title')}
      subtitle={organization.legalName}
    >
      <Card>
        <form onSubmit={form.handleSubmit} noValidate>
          <CompanyDetailsSection form={form} />
          <Button type="submit" variant="primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </form>
      </Card>
    </PageLayout>
  );
}