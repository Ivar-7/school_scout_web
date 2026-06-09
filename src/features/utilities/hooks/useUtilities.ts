import { useState, useEffect, useCallback } from 'react';
import { utilitiesApi } from '../api/utilities.api';
import type { ShortlistedSchool, Notification } from '../types/utilities.types';

const MOCK_USER_ID = 'demo-user-123';

// ── useShortlist ──────────────────────────────────────────────────────────────
export const useShortlist = () => {
  const [shortlist, setShortlist] = useState<ShortlistedSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = MOCK_USER_ID;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await utilitiesApi.shortlist.getAll(userId);
      setShortlist(data);
    } catch {
      setError('Failed to load shortlist.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (school: Omit<ShortlistedSchool, 'savedAt'>) => {
    try {
      await utilitiesApi.shortlist.add(userId, school);
      setShortlist((prev) => [
        { ...school, savedAt: { toDate: () => new Date() } } as ShortlistedSchool,
        ...prev,
      ]);
    } catch {
      setError('Failed to add to shortlist.');
    }
  };

  const remove = async (schoolId: string) => {
    try {
      await utilitiesApi.shortlist.remove(userId, schoolId);
      setShortlist((prev) => prev.filter((s) => s.schoolId !== schoolId));
    } catch {
      setError('Failed to remove from shortlist.');
    }
  };

  const clear = async () => {
    try {
      await utilitiesApi.shortlist.clear(userId);
      setShortlist([]);
    } catch {
      setError('Failed to clear shortlist.');
    }
  };

  const isShortlisted = (schoolId: string) =>
    shortlist.some((s) => s.schoolId === schoolId);

  return { shortlist, loading, error, add, remove, clear, isShortlisted, refresh: load };
};

// ── useNotifications ──────────────────────────────────────────────────────────
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = MOCK_USER_ID;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await utilitiesApi.notifications.getAll(userId);
      setNotifications(data);
    } catch {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (notificationId: string) => {
    try {
      await utilitiesApi.notifications.markRead(userId, notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch {
      setError('Failed to mark notification as read.');
    }
  };

  const markAllRead = async () => {
    try {
      await utilitiesApi.notifications.markAllRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      setError('Failed to mark all as read.');
    }
  };

  const remove = async (notificationId: string) => {
    try {
      await utilitiesApi.notifications.delete(userId, notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch {
      setError('Failed to delete notification.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markRead,
    markAllRead,
    remove,
    refresh: load,
  };
};