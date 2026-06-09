import { useState, useEffect, useCallback } from 'react';
import { applicationsApi } from '../api/applications.api';
import type {
  Application,
  ApplicationFormData,
  ApplicationStatus,
} from '../types/applications.types';

const MOCK_USER_ID = 'demo-user-123';
const MOCK_USER_NAME = 'Demo Parent';
const MOCK_USER_EMAIL = 'demo@example.com';
const MOCK_USER_PHONE = '+254700000000';

// ── useParentApplications ─────────────────────────────────────────────────────
export const useParentApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const parentId = MOCK_USER_ID;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsApi.getByParent(parentId);
      setApplications(data);
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (formData: ApplicationFormData): Promise<string | null> => {
    try {
      setSubmitting(true);
      setError(null);
      const id = await applicationsApi.submit(
        parentId,
        MOCK_USER_NAME,
        MOCK_USER_EMAIL,
        MOCK_USER_PHONE,
        formData
      );
      await load();
      return id;
    } catch {
      setError('Failed to submit application.');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    applications,
    loading,
    error,
    submitting,
    submit,
    refresh: load,
  };
};

// ── useSchoolApplications ─────────────────────────────────────────────────────
export const useSchoolApplications = (schoolId: string) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    if (!schoolId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsApi.getBySchool(schoolId);
      setApplications(data);
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (
    applicationId: string,
    status: ApplicationStatus,
    schoolNotes?: string
  ) => {
    try {
      setUpdating(true);
      await applicationsApi.updateStatus(applicationId, status, schoolNotes);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status, schoolNotes: schoolNotes ?? a.schoolNotes } : a
        )
      );
    } catch {
      setError('Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  return {
    applications,
    loading,
    error,
    updating,
    updateStatus,
    refresh: load,
  };
};

// ── useApplication (single) ───────────────────────────────────────────────────
export const useApplication = (id: string) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await applicationsApi.getById(id);
        if (!data) setError('Application not found.');
        else setApplication(data);
      } catch {
        setError('Failed to load application.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return { application, loading, error };
};