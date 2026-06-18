import { MessageCircle } from 'lucide-react'
import type { Thread } from '../types/communication.types'

interface ThreadListProps {
  threads: Thread[]
  activeThreadId: string | null
  currentUserId: string
  onSelect: (threadId: string) => void
}

export function ThreadList({ threads, activeThreadId, currentUserId, onSelect }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
        <MessageCircle className="h-8 w-8 text-muted" />
        <p className="text-sm text-muted">No conversations yet.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {threads.map((thread) => {
        const isSchoolOwner = currentUserId === thread.schoolOwnerId
        const otherName = isSchoolOwner ? thread.parentName : thread.schoolName
        const isActive = thread.id === activeThreadId

        return (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => onSelect(thread.id)}
              className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors ${
                isActive ? 'bg-brand-soft' : 'hover:bg-background'
              }`}
            >
              <span className="text-sm font-semibold text-foreground">{otherName}</span>
              <span className="truncate text-xs text-muted">
                {thread.lastMessage || 'No messages yet'}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
