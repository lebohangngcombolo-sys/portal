/**
 * Route registry — maps paths to lazy-loaded scenes.
 *
 * Every scene is `React.lazy(() => import(...))` so webpack splits it
 * into its own chunk. The `roles` array (if present) gates the route via
 * the role guard in Router.jsx; routes without roles are for any
 * authenticated user.
 */
import { lazy } from 'react';

import { ROUTES } from '../common/constants/routes.js';
import { ROLES } from '../common/constants/userRoles.js';

export const routes = [
  // ---------- public
  { path: ROUTES.ROOT, scene: lazy(() => import('../scenes/public/LandingScene.jsx')), public: true },
  { path: ROUTES.LOGIN, scene: lazy(() => import('../scenes/public/LoginScene.jsx')), public: true },
  { path: ROUTES.REGISTER, scene: lazy(() => import('../scenes/public/RegisterScene.jsx')), public: true },
  { path: ROUTES.VERIFY_EMAIL, scene: lazy(() => import('../scenes/public/EmailVerificationScene.jsx')), public: true },
  { path: ROUTES.FORGOT_PASSWORD, scene: lazy(() => import('../scenes/public/ForgotPasswordScene.jsx')), public: true },
  { path: ROUTES.RESET_PASSWORD, scene: lazy(() => import('../scenes/public/ResetPasswordScene.jsx')), public: true },
  { path: ROUTES.MFA_CHALLENGE, scene: lazy(() => import('../scenes/public/MfaChallengeScene.jsx')), public: true },

  // ---------- authenticated (any role)
  { path: ROUTES.DASHBOARD, scene: lazy(() => import('../scenes/dashboard/DashboardScene.jsx')) },
  { path: ROUTES.ACCOUNT_PROFILE, scene: lazy(() => import('../scenes/account/ProfileScene.jsx')) },
  { path: ROUTES.ACCOUNT_SECURITY, scene: lazy(() => import('../scenes/account/SecurityScene.jsx')) },
  { path: ROUTES.ACCOUNT_SESSIONS, scene: lazy(() => import('../scenes/account/SessionsScene.jsx')) },
  { path: ROUTES.ACCOUNT_MFA, scene: lazy(() => import('../scenes/account/MfaSetupScene.jsx')) },
  { path: ROUTES.ACCOUNT_NOTIFICATIONS, scene: lazy(() => import('../scenes/account/NotificationsScene.jsx')) },
  { path: ROUTES.ACCOUNT_PREFERENCES, scene: lazy(() => import('../scenes/account/PreferencesScene.jsx')) },

  // ---------- customer
  { path: ROUTES.ORGANIZATIONS, scene: lazy(() => import('../scenes/organization/OrganizationsListScene.jsx')), roles: [ROLES.CUSTOMER] },
  { path: ROUTES.ORGANIZATIONS_NEW, scene: lazy(() => import('../scenes/organization/OrganizationCreateScene.jsx')), roles: [ROLES.CUSTOMER] },
  { path: ROUTES.ORGANIZATION_DETAIL, scene: lazy(() => import('../scenes/organization/OrganizationDetailScene.jsx')), roles: [ROLES.CUSTOMER] },
  { path: ROUTES.ORGANIZATION_EDIT, scene: lazy(() => import('../scenes/organization/OrganizationEditScene.jsx')), roles: [ROLES.CUSTOMER] },
  { path: ROUTES.ORGANIZATION_REPRESENTATIVES, scene: lazy(() => import('../scenes/organization/RepresentativesScene.jsx')), roles: [ROLES.CUSTOMER] },
  { path: ROUTES.ORGANIZATION_BENEFICIAL_OWNERS, scene: lazy(() => import('../scenes/organization/BeneficialOwnersScene.jsx')), roles: [ROLES.CUSTOMER] },
  { path: ROUTES.ORGANIZATION_OWNERSHIP, scene: lazy(() => import('../scenes/organization/OwnershipDeclarationScene.jsx')), roles: [ROLES.CUSTOMER] },
  { path: ROUTES.ORGANIZATION_SUBMIT, scene: lazy(() => import('../scenes/organization/SubmissionScene.jsx')), roles: [ROLES.CUSTOMER] },

  // ---------- kyc
  { path: ROUTES.KYC_CASES, scene: lazy(() => import('../scenes/kyc/KycCaseListScene.jsx')), roles: [ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.KYC_CASE_DETAIL, scene: lazy(() => import('../scenes/kyc/KycCaseDetailScene.jsx')), roles: [ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.KYC_CASE_DOCUMENTS, scene: lazy(() => import('../scenes/kyc/KycDocumentsScene.jsx')), roles: [ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.KYC_CASE_REVIEW, scene: lazy(() => import('../scenes/kyc/KycReviewScene.jsx')), roles: [ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.KYC_CASE_DECISION, scene: lazy(() => import('../scenes/kyc/KycDecisionScene.jsx')), roles: [ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.KYC_RESUBMIT, scene: lazy(() => import('../scenes/kyc/KycResubmitScene.jsx')), roles: [ROLES.CUSTOMER] },

  // ---------- admin
  { path: ROUTES.ADMIN_USERS, scene: lazy(() => import('../scenes/admin/UsersScene.jsx')), roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_ROLES, scene: lazy(() => import('../scenes/admin/RolesScene.jsx')), roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_PERMISSIONS, scene: lazy(() => import('../scenes/admin/PermissionsScene.jsx')), roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_COUNTRIES, scene: lazy(() => import('../scenes/admin/CountriesScene.jsx')), roles: [ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_COUNTRY_DETAIL, scene: lazy(() => import('../scenes/admin/CountryDetailScene.jsx')), roles: [ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_COUNTRY_CONFIG, scene: lazy(() => import('../scenes/admin/CountryConfigScene.jsx')), roles: [ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_COUNTRY_KYC_REQUIREMENTS, scene: lazy(() => import('../scenes/admin/KycRequirementsScene.jsx')), roles: [ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_COUNTRY_ORG_REQUIREMENTS, scene: lazy(() => import('../scenes/admin/OrganizationRequirementsScene.jsx')), roles: [ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_TEMPLATES, scene: lazy(() => import('../scenes/admin/TemplatesScene.jsx')), roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { path: ROUTES.ADMIN_DELIVERIES, scene: lazy(() => import('../scenes/admin/DeliveriesScene.jsx')), roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },

  // ---------- errors
  { path: ROUTES.FORBIDDEN, scene: lazy(() => import('../scenes/error/ForbiddenScene.jsx')), public: true },
  { path: ROUTES.SERVER_ERROR, scene: lazy(() => import('../scenes/error/ServerErrorScene.jsx')), public: true },
  { path: ROUTES.MAINTENANCE, scene: lazy(() => import('../scenes/error/MaintenanceScene.jsx')), public: true },

  // ---------- not found (must be last)
  { path: ROUTES.NOT_FOUND, scene: lazy(() => import('../scenes/public/NotFoundScene.jsx')), public: true },
];