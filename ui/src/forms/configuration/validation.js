/**
 * Yup schemas for the multi-step forms.
 *
 * Rules mirror the backend validators (spec §3.4, §4.4, §6.4). Client-side
 * validation is a UX affordance — the server is still the source of truth.
 */

import * as yup from 'yup';

import {
  emailField,
  phoneField,
  passwordField,
  countryCodeField,
  languageCodeField,
  ownershipPercentageField,
  urlField,
} from '../../common/utils/validators.js';

// ------------------------------------------------------------------ registration
export const registrationSchema = yup.object({
  firstName: yup.string().trim().required('First name is required').max(100),
  lastName: yup.string().trim().required('Last name is required').max(100),
  email: emailField(),
  phoneNumber: phoneField(),
  password: passwordField(12, 128),
  countryCode: countryCodeField(),
  preferredLanguage: languageCodeField(),
  termsAccepted: yup
    .boolean()
    .oneOf([true], 'You must accept the terms to continue')
    .required(),
});

// ------------------------------------------------------------------ login
export const loginSchema = yup.object({
  identifier: yup.string().trim().required('Email or phone number is required').min(3).max(254),
  password: yup.string().required('Password is required').max(128),
});

// ------------------------------------------------------------------ email verification
export const emailVerificationSchema = yup.object({
  email: emailField(),
  code: yup
    .string()
    .required('Verification code is required')
    .matches(/^\d{6}$/, 'Code must be 6 digits'),
});

// ------------------------------------------------------------------ password reset
export const passwordResetRequestSchema = yup.object({
  email: emailField(),
});

export const passwordResetSchema = yup.object({
  token: yup.string().required('Reset code is required'),
  newPassword: passwordField(12, 128),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm your new password'),
});

// ------------------------------------------------------------------ MFA challenge
export const mfaChallengeSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .test(
      'otp-or-recovery',
      'Must be a 6-digit code or a recovery code',
      (value) => !value || /^\d{6}$/.test(value) || /^[A-Z0-9]{8}-[A-Z0-9]{8}$/.test(value),
    ),
});

// ------------------------------------------------------------------ change password
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required').max(128),
  newPassword: passwordField(12, 128),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm your new password'),
});

// ------------------------------------------------------------------ individual onboarding
export const individualOnboardingSchema = yup.object({
  firstName: yup.string().trim().required('First name is required').max(100),
  lastName: yup.string().trim().required('Last name is required').max(100),
  email: emailField(),
  phoneNumber: phoneField(),
  countryCode: countryCodeField(),
  preferredLanguage: languageCodeField(),
});

// ------------------------------------------------------------------ company onboarding
export const companyOnboardingSchema = yup.object({
  // basic
  legalName: yup.string().trim().required('Legal name is required').max(255),
  tradingName: yup.string().trim().max(255).nullable(),
  organizationType: yup.string().required('Organization type is required').max(50),
  businessDescription: yup.string().max(2000).nullable(),
  website: urlField().nullable(),

  // registration
  registrationNumber: yup
    .string()
    .trim()
    .required('Registration number is required')
    .max(100),
  taxNumber: yup.string().trim().max(100).nullable(),
  incorporationDate: yup.date().nullable().typeError('Enter a valid date'),
  registrationAuthority: yup.string().trim().max(150).nullable(),

  // address
  addressLine1: yup.string().trim().required('Address line 1 is required').max(255),
  addressLine2: yup.string().trim().max(255).nullable(),
  city: yup.string().trim().required('City is required').max(100),
  region: yup.string().trim().max(100).nullable(),
  postalCode: yup.string().trim().max(30).nullable(),
  addressCountryCode: countryCodeField(),
});

// ------------------------------------------------------------------ representative
export const representativeSchema = yup.object({
  representativeType: yup.string().required('Representative type is required').max(40),
  repFirstName: yup.string().trim().required('First name is required').max(100),
  repLastName: yup.string().trim().required('Last name is required').max(100),
  repEmail: emailField(),
  repPhoneNumber: phoneField().nullable(),
  repAuthorizedSignatory: yup.boolean().default(false),
});

// ------------------------------------------------------------------ beneficial owner
export const beneficialOwnerSchema = yup.object({
  ownerFirstName: yup.string().trim().required('First name is required').max(100),
  ownerLastName: yup.string().trim().required('Last name is required').max(100),
  ownerDateOfBirth: yup.date().nullable().typeError('Enter a valid date'),
  ownerNationalityCountryCode: yup.string().nullable(),
  ownerResidenceCountryCode: yup.string().nullable(),
  ownershipPercentage: ownershipPercentageField().when('controlType', {
    is: (val) => val === 'DIRECT' || val === 'INDIRECT',
    then: (schema) => schema.required('Ownership percentage is required for this control type'),
    otherwise: (schema) => schema.nullable(),
  }),
  controlType: yup
    .string()
    .oneOf(['DIRECT', 'INDIRECT', 'CONTROL', 'TRUST', 'NOMINEE'], 'Invalid control type')
    .required('Control type is required'),
  identityReference: yup.string().trim().max(255).nullable(),
});

// ------------------------------------------------------------------ ownership declaration
export const ownershipDeclarationSchema = yup.object({
  declaration: yup.string().trim().required('Declaration text is required').max(500),
  noBeneficialOwnersAboveThreshold: yup.boolean().default(false),
});

// ------------------------------------------------------------------ kyc document
export const kycDocumentSchema = yup.object({
  documentType: yup.string().required('Document type is required').max(60),
  requirementCode: yup.string().required('Requirement is required').max(100),
  originalFilename: yup.string().trim().required('Filename is required').max(255),
  file: yup.mixed().required('A file is required'),
});

// ------------------------------------------------------------------ KYC decision
export const kycDecisionSchema = yup.object({
  action: yup.string().oneOf(['approve', 'reject']).required(),
  note: yup.string().max(2000).nullable(),
  reasonCode: yup.string().when('action', {
    is: 'reject',
    then: (schema) => schema.required('Reason code is required when rejecting').max(100),
    otherwise: (schema) => schema.nullable(),
  }),
  reason: yup.string().when('action', {
    is: 'reject',
    then: (schema) => schema.required('Reason is required when rejecting').max(2000),
    otherwise: (schema) => schema.nullable(),
  }),
});

// ------------------------------------------------------------------ admin country config
export const countryConfigSchema = yup.object({
  changeSummary: yup.string().trim().required('Change summary is required').max(500),
  configuration: yup.object().nullable(),
});

// ------------------------------------------------------------------ admin notification template
export const notificationTemplateSchema = yup.object({
  templateCode: yup.string().trim().required('Template code is required').max(100),
  channel: yup
    .string()
    .oneOf(['EMAIL', 'SMS', 'IN_APP'], 'Invalid channel')
    .required('Channel is required'),
  languageCode: yup.string().required('Language is required').max(5),
  subjectTemplate: yup.string().max(500).nullable().when('channel', {
    is: 'EMAIL',
    then: (schema) => schema.required('Email templates require a subject'),
    otherwise: (schema) => schema.nullable(),
  }),
  bodyTemplate: yup.string().required('Body template is required'),
  enabled: yup.boolean().default(true),
});