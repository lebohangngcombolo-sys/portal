/**
 * In-app notification center.
 *
 * Polls the unread count periodically and stores the current list of
 * notifications. Scenes display the badge in the header from the count.
 */
import { useCallback } from 'react';

import { createDomainContext } from './Context.jsx';
import { NotificationProvider } from '../providers/NotificationProvider.js';

const { Provider, useState, useUpdate } = createDomainContext('Notification', {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,
});

export const NotificationProviderContext = Provider;
export const useNotificationState = useState;
export const useNotificationUpdate = useUpdate;

export function useNotifications() {
  const state = useState();
  const { set } = useUpdate();

  const refresh = useCallback(async () => {
    set({ loading: true, error: null });
    const [listRes, countRes] = await Promise.all([
      NotificationProvider.list({ page: 0, size: 20 }),
      NotificationProvider.unreadCount(),
    ]);
    set({
      notifications: listRes.ok ? listRes.result?.content ?? [] : [],
      unreadCount: countRes.ok ? countRes.result?.count ?? 0 : 0,
      loading: false,
      error: listRes.ok && countRes.ok ? null : 'Failed to load notifications',
      lastFetchedAt: Date.now(),
    });
  }, [set]);

  const markRead = useCallback(
    async (notificationId) => {
      await NotificationProvider.markRead(notificationId);
      await refresh();
    },
    [refresh],
  );

  const markAllRead = useCallback(async () => {
    await NotificationProvider.markAllRead();
    await refresh();
  }, [refresh]);

  const archive = useCallback(
    async (notificationId) => {
      await NotificationProvider.archive(notificationId);
      await refresh();
    },
    [refresh],
  );

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    error: state.error,
    refresh,
    markRead,
    markAllRead,
    archive,
  };
}