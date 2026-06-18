import { useState, useEffect, useCallback } from 'react'
import { schoolsApi } from '../api/schools.api'
import type {
  School,
  Review,
  Announcement,
  AcademicRecord,
  SchoolFilters,
  SchoolDraft,
} from '../types/schools.types'
import type { DocumentSnapshot } from 'firebase/firestore'

// ── useSchools — search/browse with filters + pagination ─────────────────────
export const useSchools = (filters: Partial<SchoolFilters> = {}) => {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const loadSchools = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        setError(null)
        const cursor = reset ? undefined : (lastDoc ?? undefined)
        const result = await schoolsApi.getAll(filters, cursor)

        setSchools((prev) => (reset ? result.schools : [...prev, ...result.schools]))
        setLastDoc(result.lastDoc)
        setHasMore(result.schools.length === 12)
      } catch {
        setError('Failed to load schools. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [JSON.stringify(filters)]
  )

  useEffect(() => {
    loadSchools(true)
  }, [JSON.stringify(filters)])

  const loadMore = () => loadSchools(false)
  const refresh = () => loadSchools(true)

  return { schools, loading, error, hasMore, loadMore, refresh }
}

// ── useSchool — single school detail ─────────────────────────────────────────
export const useSchool = (id: string) => {
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        setLoading(true)
        const data = await schoolsApi.getById(id)
        if (!data) setError('School not found.')
        else setSchool(data)
      } catch {
        setError('Failed to load school details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return { school, loading, error }
}

// ── useFeaturedSchools — for landing page ─────────────────────────────────────
export const useFeaturedSchools = () => {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    schoolsApi
      .getFeatured()
      .then(setSchools)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { schools, loading }
}

// ── useNearbySchools ──────────────────────────────────────────────────────────
export const useNearbySchools = (county: string, excludeId: string) => {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!county || !excludeId) return
    schoolsApi
      .getNearby(county, excludeId)
      .then(setSchools)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [county, excludeId])

  return { schools, loading }
}

// ── useReviews ────────────────────────────────────────────────────────────────
export const useReviews = (schoolId: string) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!schoolId) return
    schoolsApi
      .getReviews(schoolId)
      .then(setReviews)
      .catch(() => setError('Failed to load reviews.'))
      .finally(() => setLoading(false))
  }, [schoolId])

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      setSubmitting(true)
      await schoolsApi.submitReview(schoolId, review)
      const updated = await schoolsApi.getReviews(schoolId)
      setReviews(updated)
    } catch {
      setError('Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  const reply = async (reviewId: string, text: string) => {
    try {
      setSubmitting(true)
      await schoolsApi.replyToReview(schoolId, reviewId, text)
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, schoolReply: text } : r)))
    } catch {
      setError('Failed to submit reply.')
    } finally {
      setSubmitting(false)
    }
  }

  return { reviews, loading, submitting, error, addReview, reply }
}

// ── useAnnouncements ──────────────────────────────────────────────────────────
export const useAnnouncements = (schoolId: string) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!schoolId) return
    schoolsApi
      .getAnnouncements(schoolId)
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [schoolId])

  return { announcements, loading }
}

// ── useManageAnnouncements — school owner CRUD (Dashboard) ───────────────────
export const useManageAnnouncements = (
  schoolId: string,
  schoolName: string,
  schoolLogo: string
) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!schoolId) return
    try {
      setLoading(true)
      setError(null)
      const data = await schoolsApi.getAllAnnouncements(schoolId)
      setAnnouncements(data)
    } catch {
      setError('Failed to load announcements.')
    } finally {
      setLoading(false)
    }
  }, [schoolId])

  useEffect(() => {
    load()
  }, [load])

  const create = async (
    announcement: Pick<Announcement, 'title' | 'category' | 'content' | 'status'>
  ): Promise<boolean> => {
    try {
      setSubmitting(true)
      setError(null)
      await schoolsApi.createAnnouncement(schoolId, schoolName, schoolLogo, announcement)
      await load()
      return true
    } catch {
      setError('Failed to create announcement.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (announcementId: string) => {
    try {
      await schoolsApi.deleteAnnouncement(schoolId, announcementId)
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId))
    } catch {
      setError('Failed to delete announcement.')
    }
  }

  return { announcements, loading, submitting, error, create, remove }
}

// ── useCompareSchools — side-by-side comparison by id list ───────────────────
export const useCompareSchools = (ids: string[]) => {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const key = ids.join(',')

  useEffect(() => {
    if (ids.length === 0) {
      setSchools([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all(ids.map((id) => schoolsApi.getById(id)))
      .then((results) => {
        if (cancelled) return
        setSchools(results.filter((s): s is School => s !== null))
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load schools to compare.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { schools, loading, error }
}

// ── useMySchool — school-role owner's own listing (Dashboard) ────────────────
export const useMySchool = (ownerId: string) => {
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!ownerId) return
    try {
      setLoading(true)
      setError(null)
      const data = await schoolsApi.getByOwner(ownerId)
      setSchool(data)
    } catch {
      setError('Failed to load your school profile.')
    } finally {
      setLoading(false)
    }
  }, [ownerId])

  useEffect(() => {
    load()
  }, [load])

  const save = async (draft: SchoolDraft): Promise<boolean> => {
    try {
      setSaving(true)
      setError(null)
      if (school) {
        await schoolsApi.update(school.id, draft)
      } else {
        await schoolsApi.create(ownerId, draft)
      }
      await load()
      return true
    } catch {
      setError('Failed to save school profile.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return { school, loading, saving, error, save, refresh: load }
}

// ── useAcademics ──────────────────────────────────────────────────────────────
export const useAcademics = (schoolId: string) => {
  const [academics, setAcademics] = useState<AcademicRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!schoolId) return
    schoolsApi
      .getAcademics(schoolId)
      .then(setAcademics)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [schoolId])

  return { academics, loading }
}
