"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NotificationType = "like" | "comment" | "follow" | "commission";

type KindredNotification = {
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
};

const initialNotifications: KindredNotification[] = [
  {
    id: "notification-1",
    type: "like",
    name: "Moss & Moon",
    username: "mossandmoon",
    avatar: "M",
    avatarColor: "#e5eddc",
    message: "liked your post.",
    time: "10 minutes ago",
    read: false,
    href: "/u/mossandmoon",
  },
  {
    id: "notification-2",
    type: "comment",
    name: "PaperCrow",
    username: "papercrow",
    avatar: "P",
    avatarColor: "#f0dfe8",
    message: "commented on your post: \"I love this idea!\"",
    time: "1 hour ago",
    read: false,
    href: "/u/papercrow",
  },
  {
    id: "notification-3",
    type: "follow",
    name: "Little Fern Studio",
    username: "littlefernstudio",
    avatar: "F",
    avatarColor: "#e2e8f2",
    message: "started following you.",
    time: "3 hours ago",
    read: false,
    href: "/u/littlefernstudio",
  },
  {
    id: "notification-4",
    type: "commission",
    name: "PixelWitch",
    username: "pixelwitch",
    avatar: "W",
    avatarColor: "#e8e1f1",
    message: "sent you a commission request.",
    time: "Yesterday",
    read: true,
    href: "/commissions",
  },
  {
    id: "notification-5",
    type: "like",
    name: "Ink & Ivy",
    username: "inkandivy",
    avatar: "I",
    avatarColor: "#f1e5dc",
    message: "liked your post.",
    time: "Yesterday",
    read: true,
    href: "/u/inkandivy",
  },
  {
    id: "notification-6",
    type: "follow",
    name: "Starling Studio",
    username: "starlingstudio",
    avatar: "S",
    avatarColor: "#e6e5f0",
    message: "started following you.",
    time: "2 days ago",
    read: true,
    href: "/u/starlingstudio",
  },
];

const filters = ["All", "Unread", "Likes", "Comments", "Follows", "Commissions"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");

  // Load saved notification state
  useEffect(() => {
    const saved = localStorage.getItem("kindred-notifications");

    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        localStorage.removeItem("kindred-notifications");
      }
    }
  }, []);

  // Save notification state
  useEffect(() => {
    localStorage.setItem("kindred-notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !notification.read;
    if (activeFilter === "Likes") return notification.type === "like";
    if (activeFilter === "Comments") return notification.type === "comment";
    if (activeFilter === "Follows") return notification.type === "follow";
    if (activeFilter === "Commissions") return notification.type === "commission";

    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return "♡";
      case "comment":
        return "☁";
      case "follow":
        return "✿";
      case "commission":
        return "✦";
    }
  };

  const getLabel = (type: NotificationType) => {
    switch (type) {
      case "like":
        return "Like";
      case "comment":
        return "Comment";
      case "follow":
        return "Follow";
      case "commission":
        return "Commission";
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#46394f]">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#9277a8]">
              Your little corner
            </p>

            <h1 className="font-serif text-4xl text-[#59406f] md:text-5xl">
              Notifications
            </h1>

            <p className="mt-3 text-[#827a89]">
              See what has been happening around your creations.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-full border border-[#e5dce9] bg-white px-5 py-3 text-sm text-[#75558c] transition hover:bg-[#eee8f2]"
            >
              Mark all as read
            </button>
          )}
        </header>

        {/* Unread summary */}
        <div className="mb-8 rounded-2xl bg-[#eee8f2] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[#75558c]">
              ♡
            </div>

            <div>
              <p className="font-serif text-xl text-[#59406f]">
                You're all caught up on your creative community.
              </p>

              <p className="mt-1 text-sm text-[#827a89]">
                {unreadCount === 0
                  ? "You have no unread notifications."
                  : `You have ${unreadCount} unread ${
                      unreadCount === 1 ? "notification" : "notifications"
                    } waiting for you.`}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeFilter === filter
                  ? "bg-[#75558c] text-white"
                  : "border border-[#e5dce9] bg-white text-[#75558c] hover:bg-[#eee8f2]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <section className="overflow-hidden rounded-2xl border border-[#e5dce9] bg-white">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-3 text-3xl text-[#9277a8]">✿</div>

              <h2 className="font-serif text-xl text-[#59406f]">
                Nothing here just yet
              </h2>

              <p className="mt-2 text-sm text-[#827a89]">
                New activity will appear here when it happens.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`flex gap-4 p-5 transition hover:bg-[#fcfafc] ${
                  index !== filteredNotifications.length - 1
                    ? "border-b border-[#f0ebf2]"
                    : ""
                } ${!notification.read ? "bg-[#faf7fc]" : ""}`}
              >
                {/* Avatar */}
                <Link
                  href={`/u/${notification.username}`}
                  className="relative flex-shrink-0"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full font-serif text-lg text-[#59406f]"
                    style={{ backgroundColor: notification.avatarColor }}
                  >
                    {notification.avatar}
                  </div>

                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#eee8f2] text-xs text-[#75558c]">
                    {getIcon(notification.type)}
                  </div>
                </Link>

                {/* Notification content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-[#63596b]">
                    <Link
                      href={`/u/${notification.username}`}
                      className="font-medium text-[#59406f] hover:underline"
                    >
                      {notification.name}
                    </Link>{" "}
                    {notification.message}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-[#9277a8]">
                      {notification.time}
                    </span>

                    <span className="rounded-full bg-[#f1edf4] px-2 py-1 text-xs text-[#75558c]">
                      {getLabel(notification.type)}
                    </span>

                    {!notification.read && (
                      <span className="flex items-center gap-1 text-xs text-[#75558c]">
                        <span className="h-2 w-2 rounded-full bg-[#9277a8]" />
                        Unread
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                  <Link
                    href={notification.href}
                    onClick={() => markAsRead(notification.id)}
                    className="rounded-full bg-[#eee8f2] px-3 py-2 text-xs text-[#75558c] transition hover:bg-[#e4d9ec]"
                  >
                    View
                  </Link>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-[#9277a8] hover:text-[#59406f]"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/home"
            className="text-sm text-[#9277a8] transition hover:text-[#59406f]"
          >
            ← Back to your feed
          </Link>
        </div>

      </div>
    </main>
  );
}