import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, MessageCircle } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useSchool } from '../../schools/hooks/useSchools'
import { useThreads, useThreadMessages, useStartThread } from '../hooks/useCommunication'
import { ThreadList } from '../components/ThreadList'

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const schoolId = searchParams.get('schoolId')
  const { user } = useAuth()
  const { threads, loading: threadsLoading, error: threadsError } = useThreads()
  const { school } = useSchool(schoolId ?? '')
  const { startThread } = useStartThread()

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const startedFor = useRef<string | null>(null)

  useEffect(() => {
    if (!schoolId || !school || startedFor.current === schoolId) return
    startedFor.current = schoolId
    startThread(school.id, school.name, school.logoImage, school.ownerId ?? '').then((threadId) => {
      if (threadId) {
        setActiveThreadId(threadId)
        searchParams.delete('schoolId')
        setSearchParams(searchParams, { replace: true })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, school])

  const {
    messages,
    loading: messagesLoading,
    sending,
    sendMessage,
  } = useThreadMessages(activeThreadId)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null

  const handleSend = async () => {
    if (!draft.trim()) return
    await sendMessage(draft)
    setDraft('')
  }

  if (threadsLoading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </section>
    )
  }

  if (threadsError) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6 py-16">
        <p className="text-sm text-red-600">{threadsError}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted">Conversations between you and schools.</p>

      <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-xl border border-border md:grid-cols-[280px_1fr]">
        <div className="border-b border-border md:border-b-0 md:border-r">
          <ThreadList
            threads={threads}
            activeThreadId={activeThreadId}
            currentUserId={user?.uid ?? ''}
            onSelect={setActiveThreadId}
          />
        </div>

        <div className="flex min-h-[420px] flex-col">
          {!activeThread ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
              <MessageCircle className="h-8 w-8 text-muted" />
              <p className="text-sm text-muted">Select a conversation to view messages.</p>
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  {user?.uid === activeThread.schoolOwnerId
                    ? activeThread.parentName
                    : activeThread.schoolName}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-muted">No messages yet — say hello.</p>
                ) : (
                  messages.map((message) => {
                    const isMine = message.senderId === user?.uid
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            isMine ? 'bg-brand text-white' : 'bg-background text-foreground'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form
                className="flex items-center gap-2 border-t border-border p-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="flex items-center justify-center rounded-full bg-brand p-2.5 text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
