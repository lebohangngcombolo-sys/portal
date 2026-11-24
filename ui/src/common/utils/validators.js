/**
 * Yup-compatible field validators.
 *
 * These are helpers designed to plug into Yup schemas via `.test()`.
 * Every validator returns `true` for a valid value and either `false`
 * or a string (error message) for an invalid one.
 */

import * as yup from 'yup';

import { isValidEmail, normalizeEmail } from './email.js';
import { isValidE164, normalizePhone } from './phone.js';

// ------------------------------------------------------------------ field-level

export const emailField = (message = 'Invalid email address') =>
  yup
    .string()
    .trim()
    .required('Email is required')
    .max(254, 'Email must be at most 254 characters')
    .test('email-format', message, (value) => !value || isValidEmail(value))
    .transform((value) => (value ? normalizeEmail(value) : value));

export const phoneField = (message = 'Invalid E.164 phone number') =>
  yup
    .string()
    .trim()
    .required('Phone number is required')
    .test('e164-format', message, (value) => !value || isValidE164(value))
    .transform((value) => {
      if (!value) return value;
      try {
        return normalizePhone(value);
      } catch {
        return value;
      }
    });

export const passwordField = (minLength = 12, maxLength = 128) =>
  yup
    .string()
    .required('Password is required')
    .min(minLength, `Password must be at least ${minLength} characters`)
    .max(maxLength, `Password must be at most ${maxLength} characters`)
    .test('has-uppercase', 'Must contain an uppercase letter', (v) => !v || /[A-Z]/.test(v))
    .test('has-lowercase', 'Must contain a lowercase letter', (v) => !v || /[a-z]/.test(v))
    .test('has-digit', 'Must contain a digit', (v) => !v || /\d/.test(v))
    .test('has-symbol', 'Must contain a symbol', (v) => !v || /[^A-Za-z0-9]/.test(v));

export const confirmPasswordField = (passwordField) =>
  yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref(passwordField)], 'Passwords do not match');

export const countryCodeField = () =>
  yup
    .string()
    .required('Country is required')
    .matches(/^[A-Z]{2}$/, 'Country must be an ISO 3166-1 alpha-2 code');

export const languageCodeField = () =>
  yup
    .string()
    .required('Language is required')
    .matches(/^[a-z]{2}$/i, 'Language must be a 2-letter code');

export const currencyCodeField = () =>
  yup
    .string()
    .required('Currency is required')
    .matches(/^[A-Z]{3}$/, 'Currency must be an ISO 4217 code');

export const urlField = () =>
  yup
    .string()
    .trim()
    .url('Must be a valid URL')
    .max(255, 'URL must be at most 255 characters');

export const requiredStringField = (message = 'This field is required', maxLength = 255) =>
  yup.string().trim().required(message).max(maxLength);

export const dateField = (message = 'Invalid date') =>
  yup
    .date()
    .nullable()
    .test('valid-date', message, (value) => value == null || !Number.isNaN(value.getTime()));

// ------------------------------------------------------------------ cross-field helpers

/**
 * Validate that a percentage is between 0 and 100.
 */
export const ownershipPercentageField = (message = 'Must be between 0 and 100') =>
  yup
    .number()
    .min(0, message)
    .max(100, message)
    .nullable()
    .typeError('Must be a number');

/**
 * Validate that a length is a positive integer.
 */
export const positiveIntegerField = (message = 'Must be a positive number') =>
  yup.number().integer(message).positive(message).nullable().typeError('Must be a number');

/**
 * Validate an OTP-style code (6 digits).
 */
export const otpField = () =>
  yup
    .string()
    .required('Code is required')
    .matches(/^\d{6}$/, 'Code must be 6 digits');

/**
 * Validate a recovery code (XXXXXXXX-XXXXXXXX).
 */
export const recoveryCodeField = () =>
  yup
    .string()
    .required('Code is required')
    .matches(/^[A-Z0-9]{8}-[A-Z0-9]{8}$/, 'Invalid recovery code format');

/**
 * Validate that a field contains no leading/trailing whitespace.
 */
export const noOuterWhitespaceField = () =>
  yup.string().test('no-outer-whitespace', 'Remove leading/trailing spaces', (value) =>
    value == null || value === value.trim(),
  );