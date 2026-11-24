/**
 * Organization create scene — the multi-step onboarding form.
 *
 * After creation, redirects to the detail scene. The form itself is
 * composed in `forms/workflows/CompanyOnboarding.jsx`.
 */
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { CompanyOnboarding } from '../../forms/workflows/CompanyOnboarding.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { OrganizationProvider, RepresentativeProvider, BeneficialOwnerProvider } from '../../providers/index.js';

export default function OrganizationCreateScene() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values) => {
    // 1. Create the organization
    const createRes = await OrganizationProvider.create({
      legalName: values.legalName,
      tradingName: values.tradingName,
      organizationType: values.organizationType,
      registrationNumber: values.registrationNumber,
      taxNumber: values.taxNumber,
      countryCode: values.addressCountryCode,
      incorporationDate: values.incorporationDate,
      registrationAuthority: values.registrationAuthority,
      businessDescription: values.businessDescription,
      website: values.website,
    });
    if (!createRes.ok) return createRes;

    const org = createRes.result;

    // 2. Add representatives
    for (const rep of values.representatives || []) {
      await RepresentativeProvider.add(org.id, {
        firstName: rep.repFirstName,
        lastName: rep.repLastName,
        email: rep.repEmail,
        phoneNumber: rep.repPhoneNumber || null,
        representativeType: rep.representativeType,
        authorizedSignatory: Boolean(rep.repAuthorizedSignatory),
      });
    }

    // 3. Add beneficial owners
    for (const owner of values.beneficialOwners || []) {
      await BeneficialOwnerProvider.add(org.id, {
        firstName: owner.ownerFirstName,
        lastName: owner.ownerLastName,
        dateOfBirth: owner.ownerDateOfBirth || null,
        nationalityCountryCode: owner.ownerNationalityCountryCode || null,
        residenceCountryCode: owner.ownerResidenceCountryCode || null,
        ownershipPercentage: owner.ownershipPercentage ?? null,
        controlType: owner.controlType,
        identityReference: owner.identityReference || null,
      });
    }

    // 4. Submit ownership declaration if aggregate ownership exceeds threshold or if the user
    //    declared no beneficial owners
    if (values.declaration) {
      await BeneficialOwnerProvider.submitDeclaration(org.id, {
        declaration: values.declaration,
        noBeneficialOwnersAboveThreshold: Boolean(values.noBeneficialOwnersAboveThreshold),
      });
    }

    toast.success(t('organization.create.success', { defaultValue: 'Organization created' }));
    navigate(routeBuilders.organizationDetail(org.id), { replace: true });
    return { ok: true };
  };

  return (
    <PageLayout
      title={t('organization.create.title')}
      subtitle={t('organization.create.subtitle')}
    >
      <CompanyOnboarding onSubmit={handleSubmit} />
    </PageLayout>
  );
}