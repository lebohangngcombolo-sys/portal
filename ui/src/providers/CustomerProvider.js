/**
 * Customer Service provider — personal profile.
 */

import { CUSTOMER_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const CustomerProvider = {
  createProfile({ customerType, countryCode, preferredLanguage }) {
    return Provider.request({
      method: 'POST',
      path: CUSTOMER_API.MY_PROFILE,
      body: { customerType, countryCode, preferredLanguage },
    });
  },

  getOwnProfile() {
    return Provider.request({
      method: 'GET',
      path: CUSTOMER_API.MY_PROFILE,
    });
  },

  updateOwnProfile({ preferredLanguage, preferredCurrency }) {
    return Provider.request({
      method: 'PUT',
      path: CUSTOMER_API.MY_PROFILE,
      body: { preferredLanguage, preferredCurrency },
    });
  },

  get(customerId) {
    return Provider.request({
      method: 'GET',
      path: CUSTOMER_API.CUSTOMER(customerId),
    });
  },

  search({ query, countryCode, status, page = 0, size = 20 } = {}) {
    return Provider.request({
      method: 'GET',
      path: CUSTOMER_API.CUSTOMERS,
      params: { query, countryCode, status, page, size },
    });
  },

  updateStatus(customerId, { status, reason }) {
    return Provider.request({
      method: 'PATCH',
      path: CUSTOMER_API.CUSTOMER_STATUS(customerId),
      body: { status, reason },
    });
  },
};