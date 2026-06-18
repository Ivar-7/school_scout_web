import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

const db = admin.firestore();

const STATUS_LABELS: Record<string, string> = {
  submitted: "submitted",
  under_review: "under review",
  accepted: "accepted",
  rejected: "rejected",
  more_info: "awaiting more information",
};

/**
 * Notifies the applying parent whenever a school updates an application's status.
 */
export const onApplicationStatusChanged = onDocumentUpdated(
  "applications/{applicationId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;
    if (before.status === after.status) return;

    const parentId = after.parentId as string;
    const schoolName = after.schoolName as string;
    const status = after.status as string;
    const label = STATUS_LABELS[status] ?? status;

    await db
      .collection("users")
      .doc(parentId)
      .collection("notifications")
      .add({
        type: "application",
        title: `Application update from ${schoolName}`,
        body: `Your application is now ${label}.`,
        isRead: false,
        link: "/applications",
        schoolId: after.schoolId ?? null,
        schoolName,
        createdAt: admin.firestore.Timestamp.now(),
      });
  }
);
