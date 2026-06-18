import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Callable — lets a signed-in user cancel their own subscription.
 * Subscriptions are otherwise write-protected (Cloud Functions / Admin SDK only),
 * so this is the only path a client has to change subscription state directly.
 */
export const cancelSubscription = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in required.");
  }

  const ref = db.collection("subscriptions").doc(request.auth.uid);
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    throw new HttpsError("not-found", "No active subscription found.");
  }

  await ref.update({
    status: "cancelled",
    updatedAt: admin.firestore.Timestamp.now(),
  });

  return { success: true };
});
