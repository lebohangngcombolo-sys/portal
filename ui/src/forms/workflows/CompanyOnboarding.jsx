/**
 * Company onboarding workflow — organization + representatives + owners +
 * declaration + submit.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '../../hooks/useForm.js';
import { useSharedForm } from '../../contexts/FormContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { useConfig } from '../../contexts/ConfigContext.jsx';
import { companyOnboardingSchema } from '../configuration/validation.js';
import { COMPANY_ONBOARDING_SECTIONS } from '../configuration/sections.js';
import { Stepper } from '../../components/primitives/Stepper.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { CompanyDetailsSection } from '../sections/CompanyDetailsSection.jsx';
import { CompanyAddressSection } from '../sections/CompanyAddressSection.jsx';
import { RepresentativeSection } from '../sections/RepresentativeSection.jsx';
import { BeneficialOwnershipSection } from '../sections/BeneficialOwnershipSection.jsx';
import { DeclarationSection } from '../sections/DeclarationSection.jsx';
import { saveDraft, clearDraft, loadDraft } from '../helpers/draftPersistence.js';
import { aggregateOwnership } from '../../common/business/ownershipRules.js';

const WORKFLOW_ID = 'company-onboarding';

const initialValues = {
  legalName: '',
  tradingName: '',
  organizationType: '',
  registrationNumber: '',
  taxNumber: '',
  incorporationDate: '',
  registrationAuthority: '',
  businessDescription: '',
  website: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  postalCode: '',
  addressCountryCode: '',
  representatives: [],
  beneficialOwners: [],
  declaration: '',
  noBeneficialOwnersAboveThreshold: false,
};

export function CompanyOnboarding({ entityId, onSubmit }) {
  const { t } = useTranslation();
  const toast = useToast();
  const config = useConfig();
  const shared = useSharedForm(`${WORKFLOW_ID}:${entityId || 'new'}`, initialValues);
  const initial = { ...loadDraft(WORKFLOW_ID, entityId), ...shared.values };

  const form = useForm({
    initialValues: initial,
    validationSchema: companyOnboardingSchema,
    onSubmit: async (values) => {
      const result = await onSubmit?.(values);
      if (result?.ok) {
        clearDraft(WORKFLOW_ID, entityId);
        shared.reset();
      } else if (result?.messages?.length) {
        toast.error(result.messages[0]);
      }
      return result;
    },
  });

  const [stepIndex, setStepIndex] = useState(0);
  const steps = COMPANY_ONBOARDING_SECTIONS.map((s) => s.id);

  const persist = () => saveDraft(WORKFLOW_ID, form.values, entityId);
  const next = async () => {
    persist();
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else await form.handleSubmit();
  };
  const back = () => {
    persist();
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const addRepresentative = () => {
    form.setFieldValue('representatives', [
      ...(form.values.representatives || []),
      { representativeType: 'DIRECTOR', repAuthorizedSignatory: false },
    ]);
  };
  const removeRepresentative = (index) => {
    const list = [...(form.values.representatives || [])];
    list.splice(index, 1);
    form.setFieldValue('representatives', list);
  };

  const addOwner = () => {
    form.setFieldValue('beneficialOwners', [
      ...(form.values.beneficialOwners || []),
      { controlType: 'DIRECT' },
    ]);
  };
  const removeOwner = (index) => {
    const list = [...(form.values.beneficialOwners || [])];
    list.splice(index, 1);
    form.setFieldValue('beneficialOwners', list);
  };

  const threshold = config.countryConfiguration?.configuration?.['kyc.beneficial_ownership_threshold']?.value ?? 25;
  const aggregate = aggregateOwnership(form.values.beneficialOwners || []);
  const belowThreshold = aggregate < threshold;

  return (
    <div>
      <Stepper steps={steps.map((s) => t(`organization.create.sections.${s}`))} current={stepIndex} />

      {steps[stepIndex] === 'basic' && <CompanyDetailsSection form={form} />}
      {steps[stepIndex] === 'registration' && <CompanyDetailsSection form={form} />}
      {steps[stepIndex] === 'address' && <CompanyAddressSection form={form} />}
      {steps[stepIndex] === 'representatives' && (
        <div>
          {(form.values.representatives || []).map((_rep, i) => (
            <RepresentativeSection
              key={i}
              form={form}
              index={i}
              onRemove={removeRepresentative}
              isOnly={(form.values.representatives || []).length === 1}
            />
          ))}
          <Button variant="secondary" onClick={addRepresentative}>
            {t('organization.representatives.add')}
          </Button>
        </div>
      )}
      {steps[stepIndex] === 'beneficialOwners' && (
        <div>
          {(form.values.beneficialOwners || []).map((_owner, i) => (
            <BeneficialOwnershipSection
              key={i}
              form={form}
              index={i}
              onRemove={removeOwner}
              isOnly={(form.values.beneficialOwners || []).length === 1}
            />
          ))}
          <Button variant="secondary" onClick={addOwner}>
            {t('organization.beneficialOwners.add')}
          </Button>
        </div>
      )}
      {steps[stepIndex] === 'declaration' && (
        <DeclarationSection form={form} belowThreshold={belowThreshold} />
      )}

      <div>
        {stepIndex > 0 && <Button onClick={back}>{t('common.back')}</Button>}
        <Button onClick={next} disabled={form.isSubmitting}>
          {stepIndex < steps.length - 1 ? t('common.next') : t('common.submit')}
        </Button>
      </div>
    </div>
  );
}