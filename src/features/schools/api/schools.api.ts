import {
  fetchSchools,
  fetchSchoolById,
  fetchSchoolBySlug,
  fetchFeaturedSchools,
  fetchNearbySchools,
  fetchReviews,
  submitReview,
  fetchAnnouncements,
  fetchAcademicRecords,
} from '../services/schools.service';
import type { SchoolFilters, Review } from '../types/schools.types';
import type { DocumentSnapshot } from 'firebase/firestore';

// All API calls wrapped here — components never call services directly

export const schoolsApi = {
  getAll: (filters?: Partial<SchoolFilters>, lastDoc?: DocumentSnapshot) =>
    fetchSchools(filters, lastDoc),

  getById: (id: string) =>
    fetchSchoolById(id),

  getBySlug: (slug: string) =>
    fetchSchoolBySlug(slug),

  getFeatured: () =>
    fetchFeaturedSchools(),

  getNearby: (county: string, excludeId: string) =>
    fetchNearbySchools(county, excludeId),

  getReviews: (schoolId: string) =>
    fetchReviews(schoolId),

  submitReview: (schoolId: string, review: Omit<Review, 'id' | 'createdAt'>) =>
    submitReview(schoolId, review),

  getAnnouncements: (schoolId: string) =>
    fetchAnnouncements(schoolId),

  getAcademics: (schoolId: string) =>
    fetchAcademicRecords(schoolId),
};