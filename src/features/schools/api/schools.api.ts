import {
  fetchSchools,
  fetchSchoolById,
  fetchSchoolBySlug,
  fetchFeaturedSchools,
  fetchNearbySchools,
  fetchReviews,
  submitReview,
  replyToReview,
  fetchAnnouncements,
  fetchAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  fetchAcademicRecords,
  fetchSchoolByOwner,
  createSchool,
  updateSchool,
} from '../services/schools.service'
import type { SchoolFilters, Review, Announcement, SchoolDraft } from '../types/schools.types'
import type { DocumentSnapshot } from 'firebase/firestore'

// All API calls wrapped here — components never call services directly

export const schoolsApi = {
  getAll: (filters?: Partial<SchoolFilters>, lastDoc?: DocumentSnapshot) =>
    fetchSchools(filters, lastDoc),

  getById: (id: string) => fetchSchoolById(id),

  getBySlug: (slug: string) => fetchSchoolBySlug(slug),

  getFeatured: () => fetchFeaturedSchools(),

  getNearby: (county: string, excludeId: string) => fetchNearbySchools(county, excludeId),

  getReviews: (schoolId: string) => fetchReviews(schoolId),

  submitReview: (schoolId: string, review: Omit<Review, 'id' | 'createdAt'>) =>
    submitReview(schoolId, review),

  replyToReview: (schoolId: string, reviewId: string, reply: string) =>
    replyToReview(schoolId, reviewId, reply),

  getAnnouncements: (schoolId: string) => fetchAnnouncements(schoolId),

  getAllAnnouncements: (schoolId: string) => fetchAllAnnouncements(schoolId),

  createAnnouncement: (
    schoolId: string,
    schoolName: string,
    schoolLogo: string,
    announcement: Pick<Announcement, 'title' | 'category' | 'content' | 'status'>
  ) => createAnnouncement(schoolId, schoolName, schoolLogo, announcement),

  deleteAnnouncement: (schoolId: string, announcementId: string) =>
    deleteAnnouncement(schoolId, announcementId),

  getAcademics: (schoolId: string) => fetchAcademicRecords(schoolId),

  getByOwner: (ownerId: string) => fetchSchoolByOwner(ownerId),

  create: (ownerId: string, draft: SchoolDraft) => createSchool(ownerId, draft),

  update: (schoolId: string, updates: Partial<SchoolDraft>) => updateSchool(schoolId, updates),
}
