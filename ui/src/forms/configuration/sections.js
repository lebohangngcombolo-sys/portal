/**
 * Section groupings for multi-step forms.
 *
 * Each section references field keys from `fields.js`. Sections are rendered
 * by `<SectionRenderer />` (a small helper in `forms/helpers/formState.js`).
 */

import {
  PERSONAL_FIELDS,
  CONTACT_FIELDS,
  COMPANY_FIELDS,
  ADDRESS_FIELDS,
  REPRESENTATIVE_FIELDS,
  BENEFICIAL_OWNER_FIELDS,
  DOCUMENT_FIELDS,
  DECLARATION_FIELDS,
} from './fields.js';

// ------------------------------------------------------------------ individual onboarding
export const INDIVIDUAL_ONBOARDING_SECTIONS = Object.freeze([
  {
    id: 'personal',
    i18nKey: 'auth.register.title',
    fields: ['firstName', 'lastName'],
  },
  {
    id: 'contact',
    i18nKey: 'organization.create.sections.contact',
    fields: ['email', 'phoneNumber', 'countryCode', 'preferredLanguage'],
  },
]);

// ------------------------------------------------------------------ company onboarding
export const COMPANY_ONBOARDING_SECTIONS = Object.freeze([
  {
    id: 'basic',
    i18nKey: 'organization.create.sections.basic',
    fields: [
      'legalName',
      'tradingName',
      'organizationType',
      'businessDescription',
      'website',
    ],
  },
  {
    id: 'registration',
    i18nKey: 'organization.create.sections.registration',
    fields: [
      'registrationNumber',
      'taxNumber',
      'incorporationDate',
      'registrationAuthority',
    ],
  },
  {
    id: 'address',
    i18nKey: 'organization.create.sections.contact',
    fields: [
      'addressLine1',
      'addressLine2',
      'city',
      'region',
      'postalCode',
      'addressCountryCode',
    ],
  },
  {
    id: 'representatives',
    i18nKey: 'organization.representatives.title',
    fields: Object.keys(REPRESENTATIVE_FIELDS),
    repeatable: true,
  },
  {
    id: 'beneficialOwners',
    i18nKey: 'organization.beneficialOwners.title',
    fields: Object.keys(BENEFICIAL_OWNER_FIELDS),
    repeatable: true,
  },
  {
    id: 'declaration',
    i18nKey: 'organization.beneficialOwners.declaration.title',
    fields: Object.keys(DECLARATION_FIELDS),
  },
]);

// ------------------------------------------------------------------ kyc resubmission
export const KYC_RESUBMISSION_SECTIONS = Object.freeze([
  {
    id: 'documents',
    i18nKey: 'kyc.actions.resubmit',
    fields: ['documentType', 'requirementCode', 'originalFilename', 'file'],
    repeatable: true,
  },
]);

/**
 * Section by id, for a specific workflow.
 */
export function getSectionForWorkflow(workflowId) {
  switch (workflowId) {
    case 'individual-onboarding':
      return INDIVIDUAL_ONBOARDING_SECTIONS;
    case 'company-onboarding':
      return COMPANY_ONBOARDING_SECTIONS;
    case 'kyc-resubmission':
      return KYC_RESUBMISSION_SECTIONS;
    default:
      throw new Error(`Unknown onboarding workflow: ${workflowId}`);
  }
}