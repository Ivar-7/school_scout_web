import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

const db = admin.firestore();
const SUBSCRIPTION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Fires when a payments/{paymentId} doc transitions to status "paid".
 * Interprets `metadata` to decide what to activate — currently only
 * subscription payments are handled. Also drops a notification for the user.
 */
export const onPaymentConfirmed = onDocumentUpdated("payments/{paymentId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;
  if (before.status === "paid" || after.status !== "paid") return;

  const metadata = (after.metadata ?? {}) as Record<string, unknown>;
  const userId = after.userId as string;

  if (metadata.type === "subscription") {
    const tier = metadata.tier as string;
    const role = metadata.role as string;
    const now = admin.firestore.Timestamp.now();
    const endDate = admin.firestore.Timestamp.fromMillis(now.toMillis() + SUBSCRIPTION_DURATION_MS);

    await db.collection("subscriptions").doc(userId).set({
      userId,
      role,
      tier,
      status: "active",
      startDate: now,
      endDate,
      updatedAt: now,
    });

    await db
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .add({
        type: "system",
        title: "Payment successful",
        body: `Your ${tier} subscription is now active.`,
        isRead: false,
        link: "/monetization/subscriptions",
        schoolId: null,
        schoolName: null,
        createdAt: now,
      });

    logger.info("onPaymentConfirmed: subscription activated", { userId, tier });
  }
});
