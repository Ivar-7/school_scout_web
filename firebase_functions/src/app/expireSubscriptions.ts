import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Runs daily — flips any subscription past its endDate from "active" to "expired".
 * PayHero has no recurring billing, so renewal is always a fresh user-initiated
 * payment; this job just stops access once the paid period is over.
 */
export const expireSubscriptions = onSchedule("every 24 hours", async () => {
  const now = admin.firestore.Timestamp.now();
  const snapshot = await db
    .collection("subscriptions")
    .where("status", "==", "active")
    .where("endDate", "<", now)
    .get();

  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { status: "expired", updatedAt: now });
  });
  await batch.commit();

  logger.info("expireSubscriptions: expired subscriptions", { count: snapshot.size });
});
