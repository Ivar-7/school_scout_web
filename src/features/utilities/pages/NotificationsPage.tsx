import { useState } from 'react';
import { useNotifications } from '../hooks/useUtilities';
import { Bell, MessageCircle, FileText, Clock, Info, CheckCheck, X } from 'lucide-react';
import type { ElementType } from 'react';
import type { Notification } from '../types/utilities.types';

type NotificationType = 'message' | 'application' | 'deadline' | 'system';

interface TypeConfig {
  icon: ElementType;
  bg: string;
  color: string;
}

const TYPE_CONFIG: Record<NotificationType, TypeConfig> = {
  message: { icon: MessageCircle, bg: 'bg-blue-50', color: 'text-blue-600' },
  application: { icon: FileText, bg: 'bg-green-50', color: 'text-green-600' },
  deadline: { icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  system: { icon: Info, bg: 'bg-gray-50', color: 'text-gray-600' },
};

const SkeletonItem = () => (
  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Bell className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2">
      No notifications yet
    </h3>
    <p className="text-gray-500 text-sm max-w-sm">
      When schools respond to your enquiries or your application status
      changes, you will see it here.
    </p>
  </div>
);

const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const config = TYPE_CONFIG[notification.type as NotificationType] || TYPE_CONFIG.system;
  const Icon = config.icon;

  const timeAgo = (timestamp: Notification['createdAt']) => {
    try {
      const date = timestamp?.toDate?.();
      if (!date) return '';
      const diff = Date.now() - date.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return '';
    }
  };

  const notifHref = notification.link || '#';

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
        notification.isRead
          ? 'bg-white border-gray-100'
          : 'bg-green-50/40 border-green-100'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}
      >
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                notification.isRead ? 'text-gray-700' : 'text-gray-900'
              }`}
            >
              {notification.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {notification.body}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-400">
                {timeAgo(notification.createdAt)}
              </span>
              {notification.link && (
                <a
                  href={notifHref}
                  className="text-xs text-green-700 hover:underline font-medium"
                >
                  View
                </a>
              )}
              {!notification.isRead && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="text-xs text-green-700 hover:underline font-medium"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!notification.isRead && (
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="text-gray-300 hover:text-red-400 transition-colors p-1"
              aria-label="Delete notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markRead,
    markAllRead,
    remove,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');

  const filtered =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const filters: Array<{ key: 'all' | NotificationType; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'message', label: 'Messages' },
    { key: 'application', label: 'Applications' },
    { key: 'deadline', label: 'Deadlines' },
    { key: 'system', label: 'System' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-heading font-bold text-2xl text-gray-900">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-green-700 font-medium mt-0.5">
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium border border-green-200 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {filters.map((f) => {
              const count =
                f.key === 'all'
                  ? notifications.length
                  : notifications.filter((n) => n.type === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === f.key
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                  {count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeFilter === f.key
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        )}

        {!loading && notifications.length === 0 && <EmptyState />}

        {!loading && notifications.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
              No {activeFilter} notifications.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markRead}
                onDelete={remove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}