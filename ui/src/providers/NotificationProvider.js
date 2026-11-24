/**
 * Notification Service provider — customer notification centre,
 * preferences, and admin template/delivery management.
 */

import { NOTIFICATION_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const NotificationProvider = {
  // -------------------------------------------------------- me
  list({ page = 0, size = 20, unreadOnly } = {}) {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.MY_LIST,
      params: { page, size, ...(unreadOnly ? { unreadOnly: true } : {}) },
    });
  },

  unreadCount() {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.MY_UNREAD_COUNT,
    });
  },

  get(notificationId) {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.MY_BY_ID(notificationId),
    });
  },

  markRead(notificationId) {
    return Provider.request({
      method: 'PATCH',
      path: NOTIFICATION_API.MY_MARK_READ(notificationId),
      body: {},
    });
  },

  markAllRead() {
    return Provider.request({
      method: 'PATCH',
      path: NOTIFICATION_API.MY_MARK_ALL_READ,
      body: {},
    });
  },

  archive(notificationId) {
    return Provider.request({
      method: 'DELETE',
      path: NOTIFICATION_API.MY_ARCHIVE(notificationId),
    });
  },

  // -------------------------------------------------------- preferences
  getPreferences() {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.PREFERENCES,
    });
  },

  updatePreferences({ preferences }) {
    return Provider.request({
      method: 'PUT',
      path: NOTIFICATION_API.PREFERENCES,
      body: { preferences },
    });
  },

  updateChannelPreference(channel, { channel: ch, enabled, languageCode }) {
    return Provider.request({
      method: 'PATCH',
      path: NOTIFICATION_API.PREFERENCE_CHANNEL(channel),
      body: { channel: ch ?? channel, enabled, languageCode },
    });
  },

  // -------------------------------------------------------- admin templates
  adminListTemplates({ page = 0, size = 20 } = {}) {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.ADMIN_TEMPLATES,
      params: { page, size },
    });
  },

  adminGetTemplate(templateId) {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.ADMIN_TEMPLATE(templateId),
    });
  },

  adminCreateTemplate(body) {
    return Provider.request({
      method: 'POST',
      path: NOTIFICATION_API.ADMIN_TEMPLATES,
      body,
    });
  },

  adminUpdateTemplate(templateId, body) {
    return Provider.request({
      method: 'PUT',
      path: NOTIFICATION_API.ADMIN_TEMPLATE(templateId),
      body,
    });
  },

  adminToggleTemplate(templateId, { enabled }) {
    return Provider.request({
      method: 'PATCH',
      path: NOTIFICATION_API.ADMIN_TEMPLATE_STATUS(templateId),
      body: { enabled },
    });
  },

  adminPreviewTemplate(templateId, { variables, languageCode }) {
    return Provider.request({
      method: 'POST',
      path: NOTIFICATION_API.ADMIN_TEMPLATE_PREVIEW(templateId),
      body: { variables, languageCode },
    });
  },

  // -------------------------------------------------------- admin deliveries
  adminSearchDeliveries({ status, channel, notificationId, page = 0, size = 20 } = {}) {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.ADMIN_DELIVERIES,
      params: { status, channel, notificationId, page, size },
    });
  },

  adminGetDelivery(deliveryId) {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.ADMIN_DELIVERY(deliveryId),
    });
  },

  adminRetryDelivery(deliveryId) {
    return Provider.request({
      method: 'POST',
      path: NOTIFICATION_API.ADMIN_DELIVERY_RETRY(deliveryId),
      body: {},
    });
  },

  adminProviders() {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.ADMIN_PROVIDERS,
    });
  },

  adminProviderHealth() {
    return Provider.request({
      method: 'GET',
      path: NOTIFICATION_API.ADMIN_HEALTH,
    });
  },
};