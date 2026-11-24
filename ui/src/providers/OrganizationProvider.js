/**
 * Organization provider — CRUD, submission, withdrawal, status.
 */

import { ORGANIZATION_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const OrganizationProvider = {
  create(body) {
    return Provider.request({
      method: 'POST',
      path: ORGANIZATION_API.BASE,
      body,
    });
  },

  listMine() {
    return Provider.request({
      method: 'GET',
      path: `${ORGANIZATION_API.BASE}/me`,
    });
  },

  get(organizationId) {
    return Provider.request({
      method: 'GET',
      path: ORGANIZATION_API.ORGANIZATION(organizationId),
    });
  },

  update(organizationId, body) {
    return Provider.request({
      method: 'PUT',
      path: ORGANIZATION_API.ORGANIZATION(organizationId),
      body,
    });
  },

  submit(organizationId) {
    return Provider.request({
      method: 'POST',
      path: ORGANIZATION_API.ORGANIZATION_SUBMIT(organizationId),
      body: {},
    });
  },

  withdraw(organizationId, { reason }) {
    return Provider.request({
      method: 'POST',
      path: ORGANIZATION_API.ORGANIZATION_WITHDRAW(organizationId),
      body: { reason },
    });
  },

  getStatus(organizationId) {
    return Provider.request({
      method: 'GET',
      path: ORGANIZATION_API.ORGANIZATION_STATUS(organizationId),
    });
  },

  // -------------------------------------------------------- KYC cases under org
  listKycCases(organizationId) {
    return Provider.request({
      method: 'GET',
      path: ORGANIZATION_API.KYC_CASES(organizationId),
    });
  },

  createKycCase(organizationId, { caseType, reason }) {
    return Provider.request({
      method: 'POST',
      path: ORGANIZATION_API.KYC_CASES(organizationId),
      body: { caseType, reason },
    });
  },
};