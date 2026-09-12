import * as admin from "firebase-admin";

admin.initializeApp();

// ── Payment functions (PayHero integration — app-independent) ─────────────────
export { startPayheroPayment } from "./payments/startPayheroPayment.js";
export { payheroCallback, checkPaymentStatus } from "./payments/confirmPayheroPayment.js";

// ── App triggers (Elimu Connect business logic) ───────────────────────────────
export { onPaymentConfirmed } from "./app/onPaymentConfirmed.js";
export { cancelSubscription } from "./app/cancelSubscription.js";
export { expireSubscriptions } from "./app/expireSubscriptions.js";
export { onReviewCreated } from "./app/onReviewCreated.js";
export { onApplicationStatusChanged } from "./app/onApplicationStatusChanged.js";
