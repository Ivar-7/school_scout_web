import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { socialApi } from '../api/social.api'
import type { Question, Review, Announcement } from '../types/social.types'

// ── useQuestions — Q&A thread for one school ──────────────────────────────────
export const useQuestions = (schoolId: string) => {
  const { user, profile } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!schoolId) return
    try {
      setLoading(true)
      setError(null)
      const data = await socialApi.getQuestions(schoolId)
      setQuestions(data)
    } catch {
      setError('Failed to load questions.')
    } finally {
      setLoading(false)
    }
  }, [schoolId])

  useEffect(() => {
    load()
  }, [load])

  const ask = async (
    schoolName: string,
    schoolLogo: string,
    question: string
  ): Promise<boolean> => {
    if (!user) return false
    try {
      setSubmitting(true)
      await socialApi.ask(
        schoolId,
        schoolName,
        schoolLogo,
        user.uid,
        profile?.displayName ?? 'Parent',
        question
      )
      await load()
      return true
    } catch {
      setError('Failed to submit your question.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const answer = async (questionId: string, answer: string): Promise<boolean> => {
    try {
      setSubmitting(true)
      await socialApi.answer(schoolId, questionId, answer)
      await load()
      return true
    } catch {
      setError('Failed to submit your answer.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (questionId: string) => {
    try {
      await socialApi.remove(schoolId, questionId)
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
    } catch {
      setError('Failed to delete question.')
    }
  }

  return { questions, loading, submitting, error, ask, answer, remove, refresh: load }
}

// ── useRecentQuestions — cross-school feed ────────────────────────────────────
export const useRecentQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    socialApi
      .getRecentQuestions()
      .then(setQuestions)
      .catch(() => setError('Failed to load recent questions.'))
      .finally(() => setLoading(false))
  }, [])

  return { questions, loading, error }
}

// ── useRecentReviews — cross-school feed ──────────────────────────────────────
export const useRecentReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    socialApi
      .getRecentReviews()
      .then(setReviews)
      .catch(() => setError('Failed to load recent reviews.'))
      .finally(() => setLoading(false))
  }, [])

  return { reviews, loading, error }
}

// ── useRecentAnnouncements — cross-school feed ────────────────────────────────
export const useRecentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    socialApi
      .getRecentAnnouncements()
      .then(setAnnouncements)
      .catch(() => setError('Failed to load announcements.'))
      .finally(() => setLoading(false))
  }, [])

  return { announcements, loading, error }
}
