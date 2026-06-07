import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore';
import type { School, Review, Announcement, AcademicRecord, SchoolFilters } from '../types/schools.types';

const SCHOOLS_COLLECTION = 'schools';
const PAGE_SIZE = 12;

export const fetchSchools = async (
  filters: Partial<SchoolFilters> = {},
  lastDoc?: DocumentSnapshot
): Promise<{ schools: School[]; lastDoc: DocumentSnapshot | null }> => {
  let q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION),
    where('isVerified', '==', true),
    orderBy('isFeatured', 'desc'),
    orderBy('ratingAverage', 'desc'),
    limit(PAGE_SIZE)
  );

  if (filters.county) q = query(q, where('county', '==', filters.county));
  if (filters.type) q = query(q, where('type', '==', filters.type));
  if (filters.curriculum) q = query(q, where('curriculum', 'array-contains', filters.curriculum));
  if (filters.gender) q = query(q, where('gender', '==', filters.gender));
  if (filters.boardingOptions) q = query(q, where('boardingOptions', '==', filters.boardingOptions));
  if (filters.religion) q = query(q, where('religion', '==', filters.religion));
  if (filters.specialNeedsSupport) q = query(q, where('specialNeedsSupport', '==', true));
  if (lastDoc) q = query(q, startAfter(lastDoc));

  const snapshot = await getDocs(q);
  const schools = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as School[];
  const last = snapshot.docs[snapshot.docs.length - 1] ?? null;
  return { schools, lastDoc: last };
};

export const fetchSchoolById = async (id: string): Promise<School | null> => {
  const ref = doc(firebaseFirestore, SCHOOLS_COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as School;
};

export const fetchSchoolBySlug = async (slug: string): Promise<School | null> => {
  const q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION),
    where('slug', '==', slug),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as School;
};

export const fetchFeaturedSchools = async (): Promise<School[]> => {
  const q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION),
    where('isFeatured', '==', true),
    where('isVerified', '==', true),
    limit(6)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as School[];
};

export const fetchNearbySchools = async (
  county: string,
  excludeId: string
): Promise<School[]> => {
  const q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION),
    where('county', '==', county),
    where('isVerified', '==', true),
    limit(4)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }) as School)
    .filter(school => school.id !== excludeId)
    .slice(0, 3);
};

export const fetchReviews = async (schoolId: string): Promise<Review[]> => {
  const q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'reviews'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Review[];
};

export const submitReview = async (
  schoolId: string,
  review: Omit<Review, 'id' | 'createdAt'>
): Promise<void> => {
  const reviewsRef = collection(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'reviews');
  await addDoc(reviewsRef, { ...review, createdAt: serverTimestamp() });

  const reviews = await fetchReviews(schoolId);
  const avg =
    reviews.reduce((sum, r) => {
      const cats = Object.values(r.ratings);
      return sum + cats.reduce((a, b) => a + b, 0) / cats.length;
    }, 0) / reviews.length;

  await updateDoc(doc(firebaseFirestore, SCHOOLS_COLLECTION, schoolId), {
    ratingAverage: Math.round(avg * 10) / 10,
    reviewCount: reviews.length,
    updatedAt: serverTimestamp(),
  });
};

export const fetchAnnouncements = async (schoolId: string): Promise<Announcement[]> => {
  const q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'announcements'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Announcement[];
};

export const fetchAcademicRecords = async (schoolId: string): Promise<AcademicRecord[]> => {
  const q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'academics'),
    orderBy('year', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ year: d.id, ...d.data() })) as AcademicRecord[];
};