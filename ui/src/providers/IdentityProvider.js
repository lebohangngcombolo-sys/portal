/**
 * Identity Service provider — user accounts, authentication, MFA, sessions.
 * All paths map to /api/v1/identity/** (spec §3.1).
 */

import { IDENTITY_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const IdentityProvider = {
  // -------------------------------------------------------- registration
  register({ firstName, lastName, email, phoneNumber, password, countryCode, preferredLanguage, termsAccepted }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.REGISTER,
      body: { firstName, lastName, email, phoneNumber, password, countryCode, preferredLanguage, termsAccepted },
      skipAuth: true,
    });
  },

  verifyEmail({ email, code }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.VERIFY_EMAIL,
      body: { email, code },
      skipAuth: true,
    });
  },

  resendVerification({ email }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.RESEND_VERIFICATION,
      body: { email },
      skipAuth: true,
    });
  },

  verificationStatus() {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.VERIFICATION_STATUS,
    });
  },

  // -------------------------------------------------------- password
  requestPasswordReset({ email }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.PASSWORD_FORGOT,
      body: { email },
      skipAuth: true,
    });
  },

  resetPassword({ token, newPassword }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.PASSWORD_RESET,
      body: { token, newPassword },
      skipAuth: true,
    });
  },

  changePassword({ currentPassword, newPassword }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.PASSWORD_CHANGE,
      body: { currentPassword, newPassword },
    });
  },

  validatePassword({ password }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.PASSWORD_VALIDATE,
      body: { password },
    });
  },

  // -------------------------------------------------------- MFA
  mfaStatus() {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.MFA_STATUS,
    });
  },

  mfaSetupTotp({ currentPassword }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.MFA_SETUP_TOTP,
      body: { currentPassword },
    });
  },

  mfaVerifySetup({ code }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.MFA_VERIFY_SETUP,
      body: { code },
    });
  },

  mfaDisable({ code }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.MFA_DISABLE,
      body: { code },
    });
  },

  mfaChallenge() {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.MFA_CHALLENGE,
      body: {},
    });
  },

  mfaRegenerateRecovery({ code }) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.MFA_RECOVERY_REGENERATE,
      body: { code },
    });
  },

  // -------------------------------------------------------- sessions
  sessions() {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.SESSIONS,
    });
  },

  revokeSession(sessionId) {
    return Provider.request({
      method: 'DELETE',
      path: IDENTITY_API.SESSION(sessionId),
    });
  },

  // -------------------------------------------------------- admin
  adminSearchUsers({ query, page = 0, size = 20 } = {}) {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.ADMIN_USERS,
      params: { query, page, size },
    });
  },

  adminGetUser(userId) {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.ADMIN_USER(userId),
    });
  },

  adminUpdateStatus(userId, { status, reason }) {
    return Provider.request({
      method: 'PATCH',
      path: IDENTITY_API.ADMIN_USER_STATUS(userId),
      body: { status, reason },
    });
  },

  adminUnlock(userId) {
    return Provider.request({
      method: 'POST',
      path: IDENTITY_API.ADMIN_USER_UNLOCK(userId),
      body: {},
    });
  },

  adminListRoles() {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.ADMIN_ROLES,
    });
  },

  adminListPermissions() {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.ADMIN_PERMISSIONS,
    });
  },

  adminAssignRoles(userId, { roleCodes }) {
    return Provider.request({
      method: 'PUT',
      path: IDENTITY_API.ADMIN_USER_ROLES(userId),
      body: { roleCodes },
    });
  },
};