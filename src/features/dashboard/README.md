# Dashboard

The school-role portal — `/dashboard`, gated by `RoleRoute role="school"`. A single page with tabs
rather than separate routes, so it stays one `Page` orchestrator with one widget per tab.

This feature has no `api`/`service`/`types` of its own: every tab is a thin composition of hooks
that already exist in other features (Schools, Applications, Social, Communication). The exceptions
are the school-owner write paths added specifically for this portal — `useMySchool`,
`useManageAnnouncements`, and `useReviews`'s `reply()` — which live in the Schools feature since
that's where the underlying Firestore writes belong.

## Tabs

| Tab           | Widget             | Backed by                                                                                           |
| ------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| Profile       | `ProfileTab`       | `useMySchool` (Schools) — create/edit the school's own listing                                      |
| Applications  | `ApplicationsTab`  | `useSchoolApplications` (Applications) — status updates + notes                                     |
| Announcements | `AnnouncementsTab` | `useManageAnnouncements` (Schools) — create/publish/delete                                          |
| Q&A           | `QuestionsTab`     | `useQuestions` (Social) — answer parent questions                                                   |
| Reviews       | `ReviewsTab`       | `useReviews` (Schools) — reply to a review                                                          |
| Visits        | —                  | renders `VisitsPage` (Communication) directly; role-aware, so the school view appears automatically |
| Messages      | —                  | renders `MessagesPage` (Communication) directly, same reasoning                                     |

If no school exists yet for the signed-in owner, every tab except Profile is hidden — the page
shows only the "create your listing" form until one exists.
