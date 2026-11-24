/**
 * MFA rules (spec §3.1D, §3.4).
 *
 * TOTP is the preferred factor; email OTP is secondary.
 */

export const MFA_FACTOR_TYPE = Object.freeze({
  TOTP: 'TOTP',
  EMAIL_OTP: 'EMAIL_OTP',
});

/**
 * True if the user must complete an MFA challenge before obtaining tokens.
 * Triggered when the login response includes `mfaRequired: true`.
 */
export function isMfaRequired(loginResponse) {
  return Boolean(loginResponse?.mfaRequired);
}

/**
 * True if the user has a factor that can be verified (either TOTP
 * via an authenticator app, or email OTP via the identity service).
 */
export function canChallengeMfa(mfaStatus) {
  return Boolean(mfaStatus?.enabled);
}

/**
 * Number of recovery codes remaining, accounting for a null status.
 */
export function remainingRecoveryCodes(mfaStatus) {
  return Math.max(0, Number(mfaStatus?.remainingRecoveryCodes) || 0);
}

/**
 * True if the user should be nudged to regenerate recovery codes
 * (fewer than 3 remaining).
 */
export function shouldNudgeForRecoveryCodes(mfaStatus) {
  return mfaStatus?.enabled && remainingRecoveryCodes(mfaStatus) < 3;
}