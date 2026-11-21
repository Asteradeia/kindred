export type NotificationType = "like" | "comment" | "follow" | "commission";

export interface KindredNotification {
  id: string;
  type: NotificationType;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  message: string;
  time: string;
  read: boolean;
  href: string;
}
const STORAGE_KEY = "kindred-notifications";
const EVENT_NAME = "kindred-notifications-updated";
export function getNotifications(): KindredNotification[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored) as KindredNotification[];
  } catch (error) {
    console.error("Could not load notifications:", error);
    return [];
  }
}
export function addNotification(
  notification: Omit<KindredNotification, "id" | "time" | "read">
): KindredNotification {
  const newNotification: KindredNotification = {
    ...notification,
    id: `${notification.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    time: "Just now",
    read: false,
  };

  const notifications = getNotifications();
  const updated = [newNotification, ...notifications];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Could not save notification:", error);
  }

  return newNotification;
}
export function markNotificationRead(id: string): KindredNotification[] {
  const notifications = getNotifications();

  const updated = notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Could not update notification:", error);
  }

  return updated;
}
export function markAllNotificationsRead(): KindredNotification[] {
  const notifications = getNotifications();

  const updated = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Could not mark notifications as read:", error);
  }

  return updated;
}
export function subscribeToNotifications(
  callback: () => void
): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(EVENT_NAME, callback);

  return () => window.removeEventListener(EVENT_NAME, callback);
}