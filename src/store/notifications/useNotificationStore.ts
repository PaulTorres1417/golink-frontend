import { create } from "zustand";
import type { Notification, NotificationState, PageInfo } from "./types";

type NotificationActions = {
  addNotification: (notification: Notification) => void;
  addAllNotifications: (allNotifications: Notification[]) => void;
  resetCount: () => void;
  setPageInfo: (pageInfo: PageInfo) => void;
  addNotificationFetchMore: (allNotificationsMore: Notification[]) => void
};

export const useNotificationStore = create<NotificationState & NotificationActions>(
  (set) => ({
    notifications: [],
    notificationsCount: 0,
    pageInfo: null,

    addAllNotifications: (allNotifications) =>
      set(() => {
        return {
          notifications: [...allNotifications],
          notificationsCount: allNotifications.filter(n => !n.read).length
        }
      }),

    addNotification: (notification) =>
      set((state) => {
        const existing = state.notifications.some(n => n.id === notification.id);
        if (existing) return state;
        return {
          notifications: [notification, ...state.notifications],
          notificationsCount: state.notificationsCount + 1
        }
      }),

    resetCount: () => set({ notificationsCount: 0 }),
    setPageInfo: (pageInfo) => set({ pageInfo }),
    addNotificationFetchMore: (allNotificationsMore) =>
      set((state) => {
        const existing = new Set(state.notifications.map(n => n.id));
        const newNotifications = allNotificationsMore.filter(node => !existing.has(node.id));
        return { 
          notifications: [...state.notifications, ...newNotifications],
          notificationsCount: newNotifications.filter(r => !r.read).length
        }
      })
  })
);
