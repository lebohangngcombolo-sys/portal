/**
 * Organization representatives provider.
 */

import { ORGANIZATION_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const RepresentativeProvider = {
  list(organizationId) {
    return Provider.request({
      method: 'GET',
      path: ORGANIZATION_API.REPRESENTATIVES(organizationId),
    });
  },

  add(organizationId, body) {
    return Provider.request({
      method: 'POST',
      path: ORGANIZATION_API.REPRESENTATIVES(organizationId),
      body,
    });
  },

  update(organizationId, representativeId, body) {
    return Provider.request({
      method: 'PUT',
      path: ORGANIZATION_API.REPRESENTATIVE(organizationId, representativeId),
      body,
    });
  },

  remove(organizationId, representativeId) {
    return Provider.request({
      method: 'DELETE',
      path: ORGANIZATION_API.REPRESENTATIVE(organizationId, representativeId),
    });
  },

  verify(organizationId, representativeId, { status, reason }) {
    return Provider.request({
      method: 'PATCH',
      path: ORGANIZATION_API.REPRESENTATIVE_VERIFY(organizationId, representativeId),
      body: { status, reason },
    });
  },
};