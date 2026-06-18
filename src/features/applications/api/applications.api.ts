import {
  fetchParentApplications,
  fetchSchoolApplications,
  fetchApplicationById,
  submitApplication,
  updateApplicationStatus,
  hasApplied,
} from '../services/applications.service'
import type { ApplicationFormData, ApplicationStatus } from '../types/applications.types'

export const applicationsApi = {
  getByParent: (parentId: string) => fetchParentApplications(parentId),

  getBySchool: (schoolId: string) => fetchSchoolApplications(schoolId),

  getById: (id: string) => fetchApplicationById(id),

  submit: (
    parentId: string,
    parentName: string,
    parentEmail: string,
    parentPhone: string,
    formData: ApplicationFormData
  ) => submitApplication(parentId, parentName, parentEmail, parentPhone, formData),

  updateStatus: (applicationId: string, status: ApplicationStatus, schoolNotes?: string) =>
    updateApplicationStatus(applicationId, status, schoolNotes),

  hasApplied: (parentId: string, schoolId: string) => hasApplied(parentId, schoolId),
}
