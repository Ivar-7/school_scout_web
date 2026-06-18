# Communication

Direct messaging and visit-booking requests between a parent and a school.

## Collections

- `threads/{id}` — `{ schoolId, parentId, schoolOwnerId, participantIds[], lastMessage, lastMessageAt }`.
  Readable/writable only by the two participants (`participantIds`).
- `threads/{id}/messages/{id}` — append-only; readable by thread participants.
- `visitBookings/{id}` — `{ schoolId, parentId, schoolOwnerId, mode, requestedDate, notes, status }`.
  Readable/writable only by the parent or school owner involved.

## Key flows

- **Start a conversation** — `useStartThread` finds-or-creates a thread for a (parent, school) pair;
  triggered from `SchoolDetailsPage`'s "Send Enquiry" CTA or by landing on
  `/communication/messages?schoolId=`.
- **Real-time chat** (`MessagesPage`) — `onSnapshot`-backed thread list and message stream.
- **Request/manage a visit** (`VisitsPage`) — role-aware: a parent sees their own requests + a
  request form (in-person/virtual + date), a school owner sees inbound requests with
  confirm/decline controls. The same hooks/page are reused inside the Dashboard's Visits tab.
