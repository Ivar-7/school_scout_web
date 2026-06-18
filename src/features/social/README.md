# Social

Cross-school discovery: a Q&A thread per school, plus platform-wide feeds of recent reviews and
announcements. Reviews and announcements themselves are owned/written by the Schools feature
(they live under `schools/{id}/...`) — this feature reads them via `collectionGroup()` queries
rather than duplicating the data.

## Collections

- `schools/{id}/questions/{id}` — `{ schoolId, schoolName, askedBy, askedByName, question, answer, answeredAt }`.
  Anyone signed in can ask; only the school owner can answer (rules restrict the update to the
  `answer`/`answeredAt` fields); the asker can delete their own question.

## Key flows

- **Ask/browse Q&A** (`QAPage`) — `?schoolId=` shows that school's thread with an ask form (and an
  answer form if you're the owner viewing your own school); with no param it shows a
  `collectionGroup('questions')` feed of recent questions across all schools.
- **Browse reviews** (`ReviewsPage`) — `collectionGroup('reviews')` feed. Writing a review still
  happens on `SchoolDetailsPage`, where the school context is already established.
- **Browse announcements** (`AnnouncementsPage`) — `collectionGroup('announcements')` feed,
  published-only. Schools create/manage their own announcements from the Dashboard.
