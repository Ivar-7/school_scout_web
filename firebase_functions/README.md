# Firebase Cloud Functions — School Finder

This directory contains all Firebase Cloud Functions for School Finder, written in **TypeScript** using **Firebase Functions v2**. They handle M-Pesa payment initiation/confirmation via [PayHero](https://payhero.co.ke), and server-side business logic that the client isn't allowed to perform directly (security rules block these writes from the client on purpose).

---

## Functions Overview

| Function                     | Type                | Trigger                           | Description                                                                                                                                                               |
| ---------------------------- | ------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `startPayheroPayment`        | `onCall`            | Web app                           | Initiates an M-Pesa STK push for a subscription payment. App-agnostic — what the payment is _for_ is carried in `metadata` and interpreted later by `onPaymentConfirmed`. |
| `payheroCallback`            | `onRequest`         | PayHero webhook                   | Updates `payments/{id}.status` only. No business logic — that's `onPaymentConfirmed`'s job.                                                                               |
| `checkPaymentStatus`         | `onCall`            | Web app                           | Polled by the client while waiting for confirmation (in case the webhook is delayed or unreachable in local dev).                                                         |
| `onPaymentConfirmed`         | `onDocumentUpdated` | `payments/{id}`                   | When a payment flips to `paid`, activates the relevant `subscriptions/{uid}` doc and drops a notification.                                                                |
| `cancelSubscription`         | `onCall`            | Web app                           | Lets a signed-in user cancel their own subscription (the only client-writable path into `subscriptions/`).                                                                |
| `expireSubscriptions`        | `onSchedule` (24h)  | Scheduler                         | Flips subscriptions past their `endDate` from `active` to `expired`. PayHero has no recurring billing, so renewal is always a fresh payment.                              |
| `onReviewCreated`            | `onDocumentCreated` | `schools/{schoolId}/reviews/{id}` | Recomputes the school's `ratingAverage`/`reviewCount`. Runs server-side because parents (who write reviews) aren't allowed to write to the school doc directly.           |
| `onApplicationStatusChanged` | `onDocumentUpdated` | `applications/{id}`               | Notifies the applying parent whenever a school updates an application's status.                                                                                           |

---

## Payment Flow

```
Web app
  └─► startPayheroPayment({ amount, phoneNumber, description, metadata })
        ├─ Validates auth, amount, phone number
        ├─ Creates a pending doc in payments/{paymentId}
        ├─ Calls PayHero API → triggers M-Pesa STK push to the user's phone
        └─ Returns { paymentId }
              ├─► PayHero calls payheroCallback → updates payments/{id}.status
              └─► (or) client polls checkPaymentStatus until terminal
                    └─► onPaymentConfirmed (Firestore trigger) fires on status="paid"
                          └─ metadata.type === "subscription" → activates subscriptions/{uid}
```

Currently the only payment `metadata.type` the app sends is `"subscription"` (see
`src/features/monetization/services/monetization.service.ts` in the web app). Add new
`metadata.type` branches in `onPaymentConfirmed.ts` if you introduce other paid flows
(e.g. one-off application fees).

---

## Firestore Collections Written

| Collection                       | Written by                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `payments/{id}`                  | `startPayheroPayment` (create), `payheroCallback` / `checkPaymentStatus` (status updates)      |
| `subscriptions/{uid}`            | `onPaymentConfirmed` (activate), `cancelSubscription` (cancel), `expireSubscriptions` (expire) |
| `schools/{id}`                   | `onReviewCreated` (`ratingAverage`, `reviewCount` only)                                        |
| `users/{uid}/notifications/{id}` | `onPaymentConfirmed`, `onApplicationStatusChanged`                                             |

Client-side Firestore rules (`src/config/firebase/firestore.rules`) deny direct client
writes to `payments`, `subscriptions`, and the school doc's aggregate fields — all of the
above only work because Cloud Functions use the Admin SDK, which bypasses security rules.

---

## Environment Variables

Functions read PayHero secrets at runtime via `process.env`. Two separate setups — local emulator vs. deployed.

### Local Development (Emulator)

Create a `firebase_functions/.env` file (git-ignored):

```env
PAYHERO_API_KEY=your_api_key
PAYHERO_API_SECRET=your_api_secret
PAYHERO_CHANNEL_ID=1111
PAYHERO_CALLBACK_URL=https://your-tunnel-url/payheroCallback
```

The Firebase emulator picks this up automatically.

### Production (Deployed Functions)

Secrets are stored in **Google Cloud Secret Manager**, set via the Firebase CLI:

```bash
firebase functions:secrets:set PAYHERO_API_KEY
firebase functions:secrets:set PAYHERO_API_SECRET
firebase functions:secrets:set PAYHERO_CHANNEL_ID
firebase functions:secrets:set PAYHERO_CALLBACK_URL
```

| Variable               | Description                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `PAYHERO_API_KEY`      | PayHero API key                                                                                                        |
| `PAYHERO_API_SECRET`   | PayHero API secret                                                                                                     |
| `PAYHERO_CHANNEL_ID`   | PayHero channel ID (defaults to `5466` if unset)                                                                       |
| `PAYHERO_CALLBACK_URL` | Publicly accessible URL for `payheroCallback`, e.g. `https://<region>-<project-id>.cloudfunctions.net/payheroCallback` |

---

## Project Structure

```
firebase_functions/
├── src/
│   ├── index.ts                          # Exports all functions
│   ├── payments/
│   │   ├── config.ts                     # PayHero base URL, auth, phone normalisation
│   │   ├── startPayheroPayment.ts        # STK push initiation
│   │   └── confirmPayheroPayment.ts      # Webhook + status-poll callable
│   └── app/
│       ├── onPaymentConfirmed.ts         # Activates subscriptions on payment success
│       ├── cancelSubscription.ts         # User-initiated cancellation
│       ├── expireSubscriptions.ts        # Scheduled expiry sweep
│       ├── onReviewCreated.ts            # Rating/review-count aggregation
│       └── onApplicationStatusChanged.ts # Parent notification on status change
├── lib/                                  # Compiled JS output (git-ignored)
├── .env                                  # Local env vars (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup & Development

### Prerequisites

- Node.js 24
- Firebase CLI: `npm install -g firebase-tools`
- Logged in: `firebase login`
- The project's Firebase plan must be **Blaze** (pay-as-you-go) — required for scheduled functions and outbound network calls (PayHero API).

### Install Dependencies

```bash
cd firebase_functions
npm install
```

### Run Locally (Emulator)

Make sure `firebase_functions/.env` exists with valid values, then from the project root:

```bash
firebase emulators:start --only functions,firestore,auth
```

Or build and watch in one terminal while the emulator runs in another:

```bash
npm run build:watch
```

---

## Deployment

From the project root:

```bash
firebase deploy --only functions
```

Or from inside `firebase_functions/`:

```bash
npm run deploy
```

### View Live Logs

```bash
firebase functions:log
```

Or via the Firebase console: `https://console.firebase.google.com/project/<projectID>/functions`

---

## Phone Number Normalisation

All phone numbers are normalised before being sent to PayHero:

| Input format   | Normalised to            |
| -------------- | ------------------------ |
| `2547xxxxxxxx` | `07xxxxxxxx`             |
| `7xxxxxxxx`    | `07xxxxxxxx`             |
| `1xxxxxxxx`    | `01xxxxxxxx`             |
| `07xxxxxxxx`   | `07xxxxxxxx` (unchanged) |

Valid formats after normalisation must match `07xxxxxxxx` or `01xxxxxxxx`.
