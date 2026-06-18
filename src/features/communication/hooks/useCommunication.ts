import { useState, useEffect } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { communicationApi } from '../api/communication.api'
import type {
  Thread,
  Message,
  VisitBooking,
  VisitRequestInput,
  VisitStatus,
} from '../types/communication.types'

// ── useThreads — all conversations for the current user, live ────────────────
export const useThreads = () => {
  const { user } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setThreads([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = communicationApi.subscribeToThreads(
      user.uid,
      (data) => {
        setThreads(data)
        setLoading(false)
        setError(null)
      },
      () => {
        setError('Failed to load conversations.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [user])

  return { threads, loading, error }
}

// ── useThreadMessages — messages in one thread, live, plus send ──────────────
export const useThreadMessages = (threadId: string | null) => {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!threadId) {
      setMessages([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = communicationApi.subscribeToMessages(threadId, (data) => {
      setMessages(data)
      setLoading(false)
    })
    return unsubscribe
  }, [threadId])

  const sendMessage = async (text: string) => {
    if (!threadId || !user || !text.trim()) return
    try {
      setSending(true)
      await communicationApi.sendMessage(
        threadId,
        user.uid,
        profile?.displayName ?? 'User',
        text.trim()
      )
    } finally {
      setSending(false)
    }
  }

  return { messages, loading, sending, sendMessage }
}

// ── useStartThread — find-or-create a thread with a school ───────────────────
export const useStartThread = () => {
  const { user, profile } = useAuth()
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startThread = async (
    schoolId: string,
    schoolName: string,
    schoolLogo: string,
    schoolOwnerId: string
  ): Promise<string | null> => {
    if (!user) return null
    try {
      setStarting(true)
      setError(null)
      return await communicationApi.findOrCreateThread(
        user.uid,
        profile?.displayName ?? 'Parent',
        schoolId,
        schoolName,
        schoolLogo,
        schoolOwnerId
      )
    } catch {
      setError('Failed to start conversation.')
      return null
    } finally {
      setStarting(false)
    }
  }

  return { startThread, starting, error }
}

// ── useVisitBookings — role-aware: parent sees own, school sees inbound ──────
export const useVisitBookings = () => {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState<VisitBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!user) {
      setBookings([])
      setLoading(false)
      return
    }
    setLoading(true)
    const filter = profile?.role === 'school' ? { schoolOwnerId: user.uid } : { parentId: user.uid }
    const unsubscribe = communicationApi.subscribeToVisitBookings(
      filter,
      (data) => {
        setBookings(data)
        setLoading(false)
        setError(null)
      },
      () => {
        setError('Failed to load visit requests.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [user, profile?.role])

  const updateStatus = async (bookingId: string, status: VisitStatus) => {
    try {
      setUpdating(true)
      await communicationApi.updateVisitStatus(bookingId, status)
    } catch {
      setError('Failed to update visit request.')
    } finally {
      setUpdating(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    updating,
    updateStatus,
    isSchoolView: profile?.role === 'school',
  }
}

// ── useRequestVisit — parent submits a new visit request ─────────────────────
export const useRequestVisit = () => {
  const { user, profile } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitRequest = async (
    schoolOwnerId: string,
    input: VisitRequestInput
  ): Promise<boolean> => {
    if (!user) return false
    try {
      setSubmitting(true)
      setError(null)
      await communicationApi.requestVisit(
        user.uid,
        profile?.displayName ?? 'Parent',
        schoolOwnerId,
        input
      )
      return true
    } catch {
      setError('Failed to submit visit request.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { submitRequest, submitting, error }
}
