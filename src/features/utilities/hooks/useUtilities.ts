import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { utilitiesApi } from '../api/utilities.api'
import type { ShortlistedSchool, Notification } from '../types/utilities.types'
import type { School } from '../../schools/types/schools.types'

export const toShortlistedSchool = (school: School): Omit<ShortlistedSchool, 'savedAt'> => ({
  schoolId: school.id,
  schoolName: school.name,
  schoolCoverImage: school.coverImage,
  schoolCounty: school.county,
  schoolType: school.type,
  schoolRating: school.ratingAverage,
  schoolFees: { minTermFee: school.fees.minTermFee, maxTermFee: school.fees.maxTermFee },
  schoolCurriculum: school.curriculum,
  schoolIsVerified: school.isVerified,
})

// ── useShortlist ──────────────────────────────────────────────────────────────
export const useShortlist = () => {
  const { user } = useAuth()
  const userId = user?.uid ?? ''
  const [shortlist, setShortlist] = useState<ShortlistedSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) {
      setShortlist([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const data = await utilitiesApi.shortlist.getAll(userId)
      setShortlist(data)
    } catch {
      setError('Failed to load shortlist.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const add = async (school: Omit<ShortlistedSchool, 'savedAt'>) => {
    if (!userId) return
    try {
      await utilitiesApi.shortlist.add(userId, school)
      setShortlist((prev) => [
        { ...school, savedAt: { toDate: () => new Date() } } as ShortlistedSchool,
        ...prev,
      ])
    } catch {
      setError('Failed to add to shortlist.')
    }
  }

  const remove = async (schoolId: string) => {
    if (!userId) return
    try {
      await utilitiesApi.shortlist.remove(userId, schoolId)
      setShortlist((prev) => prev.filter((s) => s.schoolId !== schoolId))
    } catch {
      setError('Failed to remove from shortlist.')
    }
  }

  const clear = async () => {
    if (!userId) return
    try {
      await utilitiesApi.shortlist.clear(userId)
      setShortlist([])
    } catch {
      setError('Failed to clear shortlist.')
    }
  }

  const isShortlisted = (schoolId: string) => shortlist.some((s) => s.schoolId === schoolId)

  return { shortlist, loading, error, add, remove, clear, isShortlisted, refresh: load }
}

// ── useNotifications ──────────────────────────────────────────────────────────
export const useNotifications = () => {
  const { user } = useAuth()
  const userId = user?.uid ?? ''
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const data = await utilitiesApi.notifications.getAll(userId)
      setNotifications(data)
    } catch {
      setError('Failed to load notifications.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const markRead = async (notificationId: string) => {
    if (!userId) return
    try {
      await utilitiesApi.notifications.markRead(userId, notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      )
    } catch {
      setError('Failed to mark notification as read.')
    }
  }

  const markAllRead = async () => {
    if (!userId) return
    try {
      await utilitiesApi.notifications.markAllRead(userId)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      setError('Failed to mark all as read.')
    }
  }

  const remove = async (notificationId: string) => {
    if (!userId) return
    try {
      await utilitiesApi.notifications.delete(userId, notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch {
      setError('Failed to delete notification.')
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markRead,
    markAllRead,
    remove,
    refresh: load,
  }
}
