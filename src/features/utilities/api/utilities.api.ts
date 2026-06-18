import {
  fetchShortlist,
  isSchoolShortlisted,
  addToShortlist,
  removeFromShortlist,
  clearShortlist,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../services/utilities.service'
import type { ShortlistedSchool } from '../types/utilities.types'

export const utilitiesApi = {
  shortlist: {
    getAll: (userId: string) => fetchShortlist(userId),
    isAdded: (userId: string, schoolId: string) => isSchoolShortlisted(userId, schoolId),
    add: (userId: string, school: Omit<ShortlistedSchool, 'savedAt'>) =>
      addToShortlist(userId, school),
    remove: (userId: string, schoolId: string) => removeFromShortlist(userId, schoolId),
    clear: (userId: string) => clearShortlist(userId),
  },
  notifications: {
    getAll: (userId: string) => fetchNotifications(userId),
    markRead: (userId: string, notificationId: string) =>
      markNotificationRead(userId, notificationId),
    markAllRead: (userId: string) => markAllNotificationsRead(userId),
    delete: (userId: string, notificationId: string) => deleteNotification(userId, notificationId),
  },
}
