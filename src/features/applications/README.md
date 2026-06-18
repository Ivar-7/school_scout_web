# Applications

School admission applications: parents submit a multi-step form, schools review and update status.

## Collections

- `applications/{id}` — `{ schoolId, schoolOwnerId, parentId, studentName, ..., status, schoolNotes, documents[], submittedAt, updatedAt, reviewedAt }`.
  Readable/writable only by `parentId` or `schoolOwnerId`. `schoolOwnerId` is denormalized onto the
  doc at submit time (looked up from the school doc) so security rules and the Dashboard's
  "inbound applications" query don't need a cross-collection `get()`.

## Key flows

- **Apply** (`AdmissionFormsPage`, `/applications/admission-forms?schoolId=`) — a focused full-page
  version of `ApplicationForm`; also usable as a modal from `ApplicationsPage`'s "New Application" button.
- **Document upload** (`ApplicationForm`'s `DocumentUploader`) — real Firebase Storage upload
  (`applications/{uid}/...`, 10MB limit, image/PDF only) with a progress bar — not a URL paste field.
- **Track status** (`ApplicationsPage`) — parent's own applications, filterable by status.
- **Review inbound applications** — `useSchoolApplications(schoolId)`, consumed by the Dashboard
  feature's Applications tab; status changes trigger a notification to the parent via the
  `onApplicationStatusChanged` Cloud Function.
