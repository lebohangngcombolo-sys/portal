/**
 * Field metadata registry.
 *
 * Each field carries:
 * - `key`         — matches the form value key and Yup path
 * - `i18nKey`     — dotted path under the active locale bundle
 * - `type`        — 'text' | 'email' | 'phone' | 'password' | 'date' |
 *                   'select' | 'checkbox' | 'textarea' | 'number' | 'currency'
 * - `required`    — boolean (also enforced by Yup)
 * - `placeholder` — optional i18n key
 * - `options`     — for select fields, either an array of { value, i18nKey }
 *                   or a resolver function reading from config
 * - `maxLength`   — for text fields
 * - `autoComplete` — HTML autocomplete hint
 * - `spellCheck`  — for text fields
 */

// ------------------------------------------------------------------ personal details
export const PERSONAL_FIELDS = Object.freeze({
  firstName: {
    key: 'firstName',
    i18nKey: 'auth.register.firstName',
    type: 'text',
    required: true,
    maxLength: 100,
    autoComplete: 'given-name',
    spellCheck: false,
  },
  lastName: {
    key: 'lastName',
    i18nKey: 'auth.register.lastName',
    type: 'text',
    required: true,
    maxLength: 100,
    autoComplete: 'family-name',
    spellCheck: false,
  },
  dateOfBirth: {
    key: 'dateOfBirth',
    i18nKey: 'organization.beneficialOwners.fields.dateOfBirth',
    type: 'date',
    required: false,
    autoComplete: 'bday',
  },
  nationalityCountryCode: {
    key: 'nationalityCountryCode',
    i18nKey: 'organization.beneficialOwners.fields.nationality',
    type: 'select',
    required: false,
    optionsResolver: 'countries',
  },
  residenceCountryCode: {
    key: 'residenceCountryCode',
    i18nKey: 'organization.beneficialOwners.fields.residence',
    type: 'select',
    required: false,
    optionsResolver: 'countries',
  },
});

// ------------------------------------------------------------------ contact details
export const CONTACT_FIELDS = Object.freeze({
  email: {
    key: 'email',
    i18nKey: 'auth.register.email',
    type: 'email',
    required: true,
    maxLength: 254,
    autoComplete: 'email',
    spellCheck: false,
  },
  phoneNumber: {
    key: 'phoneNumber',
    i18nKey: 'auth.register.phoneNumber',
    type: 'phone',
    required: true,
    autoComplete: 'tel',
  },
  countryCode: {
    key: 'countryCode',
    i18nKey: 'auth.register.country',
    type: 'select',
    required: true,
    optionsResolver: 'countries',
  },
  preferredLanguage: {
    key: 'preferredLanguage',
    i18nKey: 'auth.register.language',
    type: 'select',
    required: true,
    optionsResolver: 'languages',
  },
});

// ------------------------------------------------------------------ company details
export const COMPANY_FIELDS = Object.freeze({
  legalName: {
    key: 'legalName',
    i18nKey: 'organization.create.fields.legalName',
    type: 'text',
    required: true,
    maxLength: 255,
    autoComplete: 'organization',
    spellCheck: false,
  },
  tradingName: {
    key: 'tradingName',
    i18nKey: 'organization.create.fields.tradingName',
    type: 'text',
    required: false,
    maxLength: 255,
    spellCheck: false,
  },
  organizationType: {
    key: 'organizationType',
    i18nKey: 'organization.create.fields.organizationType',
    type: 'select',
    required: true,
    optionsResolver: 'organizationTypes',
  },
  registrationNumber: {
    key: 'registrationNumber',
    i18nKey: 'organization.create.fields.registrationNumber',
    type: 'text',
    required: true,
    maxLength: 100,
    spellCheck: false,
  },
  taxNumber: {
    key: 'taxNumber',
    i18nKey: 'organization.create.fields.taxNumber',
    type: 'text',
    required: false,
    maxLength: 100,
    spellCheck: false,
  },
  incorporationDate: {
    key: 'incorporationDate',
    i18nKey: 'organization.create.fields.incorporationDate',
    type: 'date',
    required: false,
  },
  registrationAuthority: {
    key: 'registrationAuthority',
    i18nKey: 'organization.create.fields.registrationAuthority',
    type: 'text',
    required: false,
    maxLength: 150,
    spellCheck: false,
  },
  businessDescription: {
    key: 'businessDescription',
    i18nKey: 'organization.create.fields.businessDescription',
    type: 'textarea',
    required: false,
    maxLength: 2000,
  },
  website: {
    key: 'website',
    i18nKey: 'organization.create.fields.website',
    type: 'text',
    required: false,
    maxLength: 255,
    autoComplete: 'url',
    spellCheck: false,
  },
});

// ------------------------------------------------------------------ company address
export const ADDRESS_FIELDS = Object.freeze({
  addressType: {
    key: 'addressType',
    i18nKey: 'organization.create.fields.addressType',
    type: 'select',
    required: true,
    optionsResolver: 'addressTypes',
  },
  addressLine1: {
    key: 'addressLine1',
    i18nKey: 'organization.create.fields.addressLine1',
    type: 'text',
    required: true,
    maxLength: 255,
    autoComplete: 'address-line1',
  },
  addressLine2: {
    key: 'addressLine2',
    i18nKey: 'organization.create.fields.addressLine2',
    type: 'text',
    required: false,
    maxLength: 255,
    autoComplete: 'address-line2',
  },
  city: {
    key: 'city',
    i18nKey: 'organization.create.fields.city',
    type: 'text',
    required: true,
    maxLength: 100,
    autoComplete: 'address-level2',
  },
  region: {
    key: 'region',
    i18nKey: 'organization.create.fields.region',
    type: 'text',
    required: false,
    maxLength: 100,
    autoComplete: 'address-level1',
  },
  postalCode: {
    key: 'postalCode',
    i18nKey: 'organization.create.fields.postalCode',
    type: 'text',
    required: false,
    maxLength: 30,
    autoComplete: 'postal-code',
  },
  addressCountryCode: {
    key: 'addressCountryCode',
    i18nKey: 'organization.create.fields.country',
    type: 'select',
    required: true,
    optionsResolver: 'countries',
  },
});

// ------------------------------------------------------------------ representative
export const REPRESENTATIVE_FIELDS = Object.freeze({
  representativeType: {
    key: 'representativeType',
    i18nKey: 'organization.representatives.types.selectLabel',
    type: 'select',
    required: true,
    optionsResolver: 'representativeTypes',
  },
  repFirstName: {
    key: 'repFirstName',
    i18nKey: 'organization.representatives.firstName',
    type: 'text',
    required: true,
    maxLength: 100,
    autoComplete: 'given-name',
  },
  repLastName: {
    key: 'repLastName',
    i18nKey: 'organization.representatives.lastName',
    type: 'text',
    required: true,
    maxLength: 100,
    autoComplete: 'family-name',
  },
  repEmail: {
    key: 'repEmail',
    i18nKey: 'organization.representatives.email',
    type: 'email',
    required: true,
    maxLength: 254,
    autoComplete: 'email',
    spellCheck: false,
  },
  repPhoneNumber: {
    key: 'repPhoneNumber',
    i18nKey: 'organization.representatives.phoneNumber',
    type: 'phone',
    required: false,
    autoComplete: 'tel',
  },
  repAuthorizedSignatory: {
    key: 'repAuthorizedSignatory',
    i18nKey: 'organization.representatives.signatoryLabel',
    type: 'checkbox',
    required: false,
  },
});

// ------------------------------------------------------------------ beneficial owner
export const BENEFICIAL_OWNER_FIELDS = Object.freeze({
  ownerFirstName: {
    key: 'ownerFirstName',
    i18nKey: 'organization.beneficialOwners.fields.firstName',
    type: 'text',
    required: true,
    maxLength: 100,
  },
  ownerLastName: {
    key: 'ownerLastName',
    i18nKey: 'organization.beneficialOwners.fields.lastName',
    type: 'text',
    required: true,
    maxLength: 100,
  },
  ownerDateOfBirth: {
    key: 'ownerDateOfBirth',
    i18nKey: 'organization.beneficialOwners.fields.dateOfBirth',
    type: 'date',
    required: false,
  },
  ownerNationalityCountryCode: {
    key: 'ownerNationalityCountryCode',
    i18nKey: 'organization.beneficialOwners.fields.nationality',
    type: 'select',
    required: false,
    optionsResolver: 'countries',
  },
  ownerResidenceCountryCode: {
    key: 'ownerResidenceCountryCode',
    i18nKey: 'organization.beneficialOwners.fields.residence',
    type: 'select',
    required: false,
    optionsResolver: 'countries',
  },
  ownershipPercentage: {
    key: 'ownershipPercentage',
    i18nKey: 'organization.beneficialOwners.fields.ownershipPercentage',
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    step: 0.01,
  },
  controlType: {
    key: 'controlType',
    i18nKey: 'organization.beneficialOwners.fields.controlType',
    type: 'select',
    required: true,
    optionsResolver: 'controlTypes',
  },
  identityReference: {
    key: 'identityReference',
    i18nKey: 'organization.beneficialOwners.fields.identityReference',
    type: 'text',
    required: false,
    maxLength: 255,
    spellCheck: false,
  },
});

// ------------------------------------------------------------------ documents
export const DOCUMENT_FIELDS = Object.freeze({
  documentType: {
    key: 'documentType',
    i18nKey: 'kyc.documents.documentType',
    type: 'select',
    required: true,
    optionsResolver: 'documentTypes',
  },
  requirementCode: {
    key: 'requirementCode',
    i18nKey: 'kyc.documents.requirementCode',
    type: 'select',
    required: true,
    optionsResolver: 'kycRequirements',
  },
  originalFilename: {
    key: 'originalFilename',
    i18nKey: 'kyc.documents.filename',
    type: 'text',
    required: true,
    maxLength: 255,
    spellCheck: false,
  },
  file: {
    key: 'file',
    i18nKey: 'kyc.documents.file',
    type: 'file',
    required: true,
  },
});

// ------------------------------------------------------------------ declaration
export const DECLARATION_FIELDS = Object.freeze({
  declaration: {
    key: 'declaration',
    i18nKey: 'organization.beneficialOwners.declaration.body',
    type: 'textarea',
    required: true,
    maxLength: 500,
  },
  noBeneficialOwnersAboveThreshold: {
    key: 'noBeneficialOwnersAboveThreshold',
    i18nKey: 'organization.beneficialOwners.declaration.confirmNoOwners',
    type: 'checkbox',
    required: false,
  },
});

// ------------------------------------------------------------------ convenience
export const ALL_FIELDS = Object.freeze({
  ...PERSONAL_FIELDS,
  ...CONTACT_FIELDS,
  ...COMPANY_FIELDS,
  ...ADDRESS_FIELDS,
  ...REPRESENTATIVE_FIELDS,
  ...BENEFICIAL_OWNER_FIELDS,
  ...DOCUMENT_FIELDS,
  ...DECLARATION_FIELDS,
});

/**
 * Resolve a field metadata entry, throwing if the key doesn't exist.
 * Prevents typos from silently rendering blank inputs.
 */
export function getField(key) {
  const field = ALL_FIELDS[key];
  if (!field) {
    throw new Error(`Unknown form field: ${key}`);
  }
  return field;
}