import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Recomputes a school's ratingAverage/reviewCount on every new review.
 * Runs server-side (Admin SDK) because clients (parents) aren't allowed to
 * write to the school doc directly — only the school's own owner can.
 */
export const onReviewCreated = onDocumentCreated(
  "schools/{schoolId}/reviews/{reviewId}",
  async (event) => {
    const review = event.data?.data();
    if (!review) return;
    const { schoolId } = event.params;

    const ratings = (review.ratings ?? {}) as Record<string, number>;
    const values = Object.values(ratings);
    if (values.length === 0) return;
    const reviewAvg = values.reduce((a, b) => a + b, 0) / values.length;

    const schoolRef = db.collection("schools").doc(schoolId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(schoolRef);
      if (!snap.exists) return;
      const data = snap.data() ?? {};
      const oldCount = (data.reviewCount as number) ?? 0;
      const oldAvg = (data.ratingAverage as number) ?? 0;
      const newCount = oldCount + 1;
      const newAvg = (oldAvg * oldCount + reviewAvg) / newCount;

      tx.update(schoolRef, {
        ratingAverage: Math.round(newAvg * 10) / 10,
        reviewCount: newCount,
        updatedAt: admin.firestore.Timestamp.now(),
      });
    });
  }
);
