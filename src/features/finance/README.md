# Finance

Fee and transport comparison across schools. There is no separate Firestore collection here —
fees/transport are fields on the `School` doc (owned by the Schools feature); this feature is a
thin read-only layer that fetches a set of schools by id and renders a comparison view.

## Key flows

- **Compare fees** (`FeesPage`, `/finance/fees?schools=id1,id2`) — a card per school with
  min/max term fee, admission fee, uniform estimate, and accepted payment methods.
- **Compare transport** (`TransportRoutesPage`, `/finance/transport?schools=id1,id2`) — availability,
  monthly cost, and routes per school.

Both pages share the `schools` query-param convention with `ComparePage` (Schools feature) — select
schools via the "Compare" checkboxes on `SchoolsPage`/`ShortlistsPage`, then land on whichever
comparison view is relevant.
