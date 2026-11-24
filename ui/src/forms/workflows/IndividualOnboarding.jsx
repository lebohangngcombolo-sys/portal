/**
 * Individual onboarding workflow — combined registration + profile creation.
 *
 * Steps:
 * 1. Personal details
 * 2. Contact details
 * 3. Review & submit
 */
import { useTranslation } from 'react-i18next';

import { useForm } from '../../hooks/useForm.js';
import { useSharedForm } from '../../contexts/FormContext.jsx';
import { individualOnboardingSchema } from '../configuration/validation.js';
import { Stepper } from '../../components/primitives/Stepper.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { PersonalDetailsSection } from '../sections/PersonalDetailsSection.jsx';
import { ContactDetailsSection } from '../sections/ContactDetailsSection.jsx';
import { saveDraft, clearDraft, loadDraft } from '../helpers/draftPersistence.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const WORKFLOW_ID = 'individual-onboarding';
const STEPS = ['personal', 'contact', 'review'];

export function IndividualOnboarding({ onSubmit }) {
  const { t } = useTranslation();
  const toast = useToast();
  const shared = useSharedForm(WORKFLOW_ID, {});
  const initial = { ...loadDraft(WORKFLOW_ID), ...shared.values };

  const form = useForm({
    initialValues: initial,
    validationSchema: individualOnboardingSchema,
    onSubmit: async (values) => {
      const result = await onSubmit?.(values);
      if (result?.ok) {
        clearDraft(WORKFLOW_ID);
        shared.reset();
      } else if (result?.messages?.length) {
        toast.error(result.messages[0]);
      }
      return result;
    },
  });

  const [stepIndex, setStepIndex] = React.useState(0);
  const step = STEPS[stepIndex];

  const handleNext = async () => {
    saveDraft(WORKFLOW_ID, form.values);
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
    else await form.handleSubmit();
  };

  const handleBack = () => {
    saveDraft(WORKFLOW_ID, form.values);
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <div>
      <Stepper steps={STEPS.map((s) => t(`onboarding.steps.${s}`))} current={stepIndex} />
      {step === 'personal' && <PersonalDetailsSection form={form} />}
      {step === 'contact' && <ContactDetailsSection form={form} />}
      {step === 'review' && (
        <pre>{JSON.stringify(form.values, null, 2)}</pre>
      )}
      <div>
        {stepIndex > 0 && <Button onClick={handleBack}>{t('common.back')}</Button>}
        <Button onClick={handleNext} disabled={form.isSubmitting}>
          {stepIndex < STEPS.length - 1 ? t('common.next') : t('common.submit')}
        </Button>
      </div>
    </div>
  );
}