/**
 * Beneficial ownership provider.
 */

import { ORGANIZATION_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const BeneficialOwnerProvider = {
  list(organizationId) {
    return Provider.request({
      method: 'GET',
      path: ORGANIZATION_API.BENEFICIAL_OWNERS(organizationId),
    });
  },

  get(organizationId, ownerId) {
    return Provider.request({
      method: 'GET',
      path: ORGANIZATION_API.BENEFICIAL_OWNER(organizationId, ownerId),
    });
  },

  add(organizationId, body) {
    return Provider.request({
      method: 'POST',
      path: ORGANIZATION_API.BENEFICIAL_OWNERS(organizationId),
      body,
    });
  },

  update(organizationId, ownerId, body) {
    return Provider.request({
      method: 'PUT',
      path: ORGANIZATION_API.BENEFICIAL_OWNER(organizationId, ownerId),
      body,
    });
  },

  remove(organizationId, ownerId) {
    return Provider.request({
      method: 'DELETE',
      path: ORGANIZATION_API.BENEFICIAL_OWNER(organizationId, ownerId),
    });
  },

  submitDeclaration(organizationId, { declaration, noBeneficialOwnersAboveThreshold }) {
    return Provider.request({
      method: 'POST',
      path: ORGANIZATION_API.OWNERSHIP_SUBMIT(organizationId),
      body: { declaration, noBeneficialOwnersAboveThreshold },
    });
  },
};