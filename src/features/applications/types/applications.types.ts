import { Timestamp } from 'firebase/firestore';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'more_info';

export type DocumentType =
  | 'birth_certificate'
  | 'report_card'
  | 'passport_photo'
  | 'medical'
  | 'other';

export interface ApplicationDocument {
  name: string;
  type: DocumentType;
  url: string;
}

export interface Application {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolLogo: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  studentName: string;
  studentDOB: string;
  studentGender: 'male' | 'female';
  gradeApplying: string;
  currentSchool: string;
  specialNeeds: boolean;
  specialNeedsDetails: string;
  status: ApplicationStatus;
  schoolNotes: string;
  parentMessage: string;
  documents: ApplicationDocument[];
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  reviewedAt: Timestamp | null;
}

export interface ApplicationFormData {
  schoolId: string;
  schoolName: string;
  schoolLogo: string;
  studentName: string;
  studentDOB: string;
  studentGender: 'male' | 'female';
  gradeApplying: string;
  currentSchool: string;
  specialNeeds: boolean;
  specialNeedsDetails: string;
  parentMessage: string;
  documents: ApplicationDocument[];
}

// Fixed the multiline generic definition here
export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string }
> = {
  submitted: {
    label: 'Submitted',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  accepted: {
    label: 'Accepted',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
  },
  more_info: {
    label: 'More Info Needed',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
  },
};