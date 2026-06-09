import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore';
import type { ShortlistedSchool, Notification } from '../types/utilities.types';

// ── Shortlist helpers ─────────────────────────────────────────────────────────

const shortlistRef = (userId: string) =>
  collection(firebaseFirestore, 'users', userId, 'shortlists');

const shortlistDocRef = (userId: string, schoolId: string) =>
  doc(firebaseFirestore, 'users', userId, 'shortlists', schoolId);

export const fetchShortlist = async (
  userId: string
): Promise<ShortlistedSchool[]> => {
  const q = query(shortlistRef(userId), orderBy('savedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as ShortlistedSchool);
};

export const isSchoolShortlisted = async (
  userId: string,
  schoolId: string
): Promise<boolean> => {
  const snapshot = await getDoc(shortlistDocRef(userId, schoolId));
  return snapshot.exists();
};

export const addToShortlist = async (
  userId: string,
  school: Omit<ShortlistedSchool, 'savedAt'>
): Promise<void> => {
  await setDoc(shortlistDocRef(userId, school.schoolId), {
    ...school,
    savedAt: serverTimestamp(),
  });
};

export const removeFromShortlist = async (
  userId: string,
  schoolId: string
): Promise<void> => {
  await deleteDoc(shortlistDocRef(userId, schoolId));
};

export const clearShortlist = async (userId: string): Promise<void> => {
  const snapshot = await getDocs(shortlistRef(userId));
  const batch = writeBatch(firebaseFirestore);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
};

// ── Notification helpers ──────────────────────────────────────────────────────

const notificationsRef = (userId: string) =>
  collection(firebaseFirestore, 'users', userId, 'notifications');

const notificationDocRef = (userId: string, notificationId: string) =>
  doc(firebaseFirestore, 'users', userId, 'notifications', notificationId);

export const fetchNotifications = async (
  userId: string
): Promise<Notification[]> => {
  const q = query(notificationsRef(userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Notification[];
};

export const markNotificationRead = async (
  userId: string,
  notificationId: string
): Promise<void> => {
  await updateDoc(notificationDocRef(userId, notificationId), {
    isRead: true,
  });
};

export const markAllNotificationsRead = async (
  userId: string
): Promise<void> => {
  const snapshot = await getDocs(notificationsRef(userId));
  const batch = writeBatch(firebaseFirestore);
  snapshot.docs
    .filter((d) => !d.data().isRead)
    .forEach((d) => batch.update(d.ref, { isRead: true }));
  await batch.commit();
};

export const deleteNotification = async (
  userId: string,
  notificationId: string
): Promise<void> => {
  await deleteDoc(notificationDocRef(userId, notificationId));
};