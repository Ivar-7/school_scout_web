# Auth

Email/password authentication and session state for the two roles in the app: `parent` and `school`.

## Collections

- `users/{uid}` — profile doc created at sign-up: `{ uid, email, displayName, role, phone, photoURL, schoolId, createdAt }`. Owner read/write only.

## Key flows

- **Sign up** (`RegisterPage`) — role picker (parent/school) + zod-validated form → `authApi.signUp` creates the Firebase Auth user and the `users/{uid}` profile doc.
- **Sign in / sign out** (`LoginPage`, `AppShell`) — standard email/password; redirects back to the page the user was trying to reach (`location.state.from`).
- **Session hydration** (`AuthProvider`, mounted in `app/providers/AppProviders.tsx`) — one `onAuthStateChanged` listener hydrates the `useAuthStore` zustand store with the Firebase `User` + Firestore profile on load and on every auth change.
- **Route guards** — `ProtectedRoute` (any signed-in user) and `RoleRoute` (a specific role) wrap route subtrees in `src/routes.tsx`.

`useAuth()` is the single hook everything else in the app reads `user`/`profile`/`role`/`isAuthenticated` from.
