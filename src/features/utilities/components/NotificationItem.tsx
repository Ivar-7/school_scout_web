import { MessageCircle, FileText, Clock, Info, X } from 'lucide-react'
import type { ElementType } from 'react'
import type { Notification } from '../types/utilities.types'

type NotificationType = 'message' | 'application' | 'deadline' | 'system'

interface TypeConfig {
  icon: ElementType
  bg: string
  color: string
}

const TYPE_CONFIG: Record<NotificationType, TypeConfig> = {
  message: { icon: MessageCircle, bg: 'bg-blue-50', color: 'text-blue-600' },
  application: { icon: FileText, bg: 'bg-green-50', color: 'text-green-600' },
  deadline: { icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
  system: { icon: Info, bg: 'bg-gray-50', color: 'text-gray-600' },
}

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

export const NotificationItem = ({ notification, onMarkRead, onDelete }: NotificationItemProps) => {
  const config = TYPE_CONFIG[notification.type]
  const Icon = config.icon

  const timeAgo = (timestamp: Notification['createdAt']) => {
    try {
      const date = timestamp?.toDate?.()
      if (!date) return ''
      const diff = Date.now() - date.getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 1) return 'Just now'
      if (mins < 60) return `${mins}m ago`
      const hrs = Math.floor(mins / 60)
      if (hrs < 24) return `${hrs}h ago`
      return `${Math.floor(hrs / 24)}d ago`
    } catch {
      return ''
    }
  }

  const notifHref = notification.link || '#'

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
        notification.isRead ? 'bg-white border-gray-100' : 'bg-green-50/40 border-green-100'
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
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.body}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</span>
              {notification.link && (
                <a href={notifHref} className="text-xs text-green-700 hover:underline font-medium">
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
            {!notification.isRead && <div className="w-2 h-2 bg-green-600 rounded-full" />}
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
  )
}
