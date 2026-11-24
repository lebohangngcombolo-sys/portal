/**
 * Notification channels (spec §5.4).
 */

export const CHANNELS = Object.freeze({
  EMAIL: Object.freeze({
    code: 'EMAIL',
    labelKey: 'notifications.preferences.channels.EMAIL',
    icon: 'email',
  }),
  SMS: Object.freeze({
    code: 'SMS',
    labelKey: 'notifications.preferences.channels.SMS',
    icon: 'sms',
  }),
  IN_APP: Object.freeze({
    code: 'IN_APP',
    labelKey: 'notifications.preferences.channels.IN_APP',
    icon: 'bell',
  }),
});

export const CHANNEL_CODES = Object.freeze(Object.keys(CHANNELS));