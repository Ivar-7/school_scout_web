import { useState, useEffect, useCallback } from 'react';
import { schoolsApi } from '../api/schools.api';
import type {
  School,
  Review,
  Announcement,
  AcademicRecord,
  SchoolFilters,
} from '../types/schools.types';
import type { DocumentSnapshot } from 'firebase/firestore';

// ── useSchools — search/browse with filters + pagination ─────────────────────
export const useSchools = (filters: Partial<SchoolFilters> = {}) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadSchools = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const cursor = reset ? undefined : lastDoc ?? undefined;
      const result = await schoolsApi.getAll(filters, cursor);

      setSchools(prev => reset ? result.schools : [...prev, ...result.schools]);
      setLastDoc(result.lastDoc);
      setHasMore(result.schools.length === 12);
    } catch (err) {
      setError('Failed to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    loadSchools(true);
  }, [JSON.stringify(filters)]);

  const loadMore = () => loadSchools(false);
  const refresh = () => loadSchools(true);

  return { schools, loading, error, hasMore, loadMore, refresh };
};

// ── useSchool — single school detail ─────────────────────────────────────────
export const useSchool = (id: string) => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await schoolsApi.getById(id);
        if (!data) setError('School not found.');
        else setSchool(data);
      } catch {
        setError('Failed to load school details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return { school, loading, error };
};

// ── useFeaturedSchools — for landing page ─────────────────────────────────────
export const useFeaturedSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolsApi.getFeatured()
      .then(setSchools)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { schools, loading };
};

// ── useNearbySchools ──────────────────────────────────────────────────────────
export const useNearbySchools = (county: string, excludeId: string) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!county || !excludeId) return;
    schoolsApi.getNearby(county, excludeId)
      .then(setSchools)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [county, excludeId]);

  return { schools, loading };
};

// ── useReviews ────────────────────────────────────────────────────────────────
export const useReviews = (schoolId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    schoolsApi.getReviews(schoolId)
      .then(setReviews)
      .catch(() => setError('Failed to load reviews.'))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      setSubmitting(true);
      await schoolsApi.submitReview(schoolId, review);
      const updated = await schoolsApi.getReviews(schoolId);
      setReviews(updated);
    } catch {
      setError('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return { reviews, loading, submitting, error, addReview };
};

// ── useAnnouncements ──────────────────────────────────────────────────────────
export const useAnnouncements = (schoolId: string) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;
    schoolsApi.getAnnouncements(schoolId)
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [schoolId]);

  return { announcements, loading };
};

// ── useAcademics ──────────────────────────────────────────────────────────────
export const useAcademics = (schoolId: string) => {
  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;
    schoolsApi.getAcademics(schoolId)
      .then(setAcademics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [schoolId]);

  return { academics, loading };
};