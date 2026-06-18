# Schools

The core directory: browsing, filtering, comparing, and reviewing schools. Also owns the
school-owner's create/edit-listing capability used by the Dashboard feature.

## Collections

- `schools/{id}` — public read; create/update/delete restricted to `ownerId == auth.uid`.
- `schools/{id}/reviews/{id}` — public read; created by any signed-in parent; `schoolReply` is the
  only field the school owner can update. `ratingAverage`/`reviewCount` on the parent school doc
  are recomputed server-side by the `onReviewCreated` Cloud Function — not by the client.
- `schools/{id}/announcements/{id}`, `schools/{id}/academics/{id}` — public read, owner-only write.

## Key flows

- **Browse/filter/sort** (`SchoolsPage`) — paginated Firestore query (`useSchools`), client-side
  search/sort on top of the page.
- **Details** (`SchoolDetailsPage`) — tabbed profile (Overview/Academics/Facilities/Fees/Reviews/Gallery),
  write-a-review modal, shortlist toggle, "Open in Google Maps" link (no Maps API key needed),
  and CTAs into Communication (visit request, message) and Social (ask a question).
- **Compare** (`ComparePage`, `/schools/compare?schools=id1,id2`) — side-by-side table for up to 4
  schools selected via the compare checkboxes on `SchoolsPage`/`ShortlistsPage`.
- **Manage own listing** (`useMySchool`, consumed by the Dashboard feature) — create/update a
  school doc keyed by `ownerId`.

Note: there's no platform-admin moderation step, so `isVerified` is not used to gate search
results — a school is discoverable as soon as its owner creates the listing.
