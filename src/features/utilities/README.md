# Utilities

Per-user conveniences: a shortlist of saved schools, and notifications.

## Collections

- `users/{uid}/shortlist/{schoolId}` — denormalized school summary (`schoolName`, `schoolCoverImage`,
  `schoolFees`, etc.) saved at the moment a school is shortlisted, via `toShortlistedSchool()` in
  `hooks/useUtilities.ts`. Owner read/write only.
- `users/{uid}/notifications/{id}` — `{ type, title, body, isRead, link, schoolId, schoolName, createdAt }`.
  Owner can read/mark-read/delete; **cannot create** — notifications are always written
  server-side by Cloud Functions (`onPaymentConfirmed`, `onApplicationStatusChanged`).

## Key flows

- **Shortlist** (`ShortlistsPage`, heart buttons on `SchoolCard`/`SchoolDetailsPage`) — `useShortlist()`
  add/remove/clear; also feeds the multi-select "Compare" tray.
- **Notifications** (`NotificationsPage`, bell icon + unread badge in `AppShell`) — `useNotifications()`
  exposes `unreadCount` for the nav badge, plus mark-read/mark-all-read/delete.
