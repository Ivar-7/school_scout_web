import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore';
import type {
  Subscription,
  Payment,
  SubscriptionTier,
  UserRole,
} from '../types/monetization.types';

const SUBSCRIPTIONS = 'subscriptions';
const PAYMENTS = 'payments';

// ── Subscription ──────────────────────────────────────────────────────────────

export const fetchSubscription = async (
  userId: string
): Promise<Subscription | null> => {
  const ref = doc(firebaseFirestore, SUBSCRIPTIONS, userId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Subscription;
};

export const createOrUpdateSubscription = async (
  userId: string,
  role: UserRole,
  tier: SubscriptionTier,
  mpesaPhone: string,
  amount: number
): Promise<void> => {
  const now = Timestamp.now();
  const endDate = new Timestamp(
    now.seconds + 30 * 24 * 60 * 60,
    now.nanoseconds
  );

  await setDoc(doc(firebaseFirestore, SUBSCRIPTIONS, userId), {
    userId,
    role,
    tier,
    status: 'active',
    mpesaPhone,
    amount,
    startDate: now,
    endDate,
    autoRenew: true,
    createdAt: now,
    updatedAt: serverTimestamp(),
  });
};

export const cancelSubscription = async (userId: string): Promise<void> => {
  await setDoc(
    doc(firebaseFirestore, SUBSCRIPTIONS, userId),
    { status: 'cancelled', autoRenew: false, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

// ── Payments ──────────────────────────────────────────────────────────────────

export const fetchPayments = async (userId: string): Promise<Payment[]> => {
  const q = query(
    collection(firebaseFirestore, PAYMENTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Payment[];
};

export const createPayment = async (
  userId: string,
  tier: SubscriptionTier,
  amount: number,
  phone: string,
  description: string
): Promise<string> => {
  const ref = await addDoc(collection(firebaseFirestore, PAYMENTS), {
    userId,
    subscriptionId: userId,
    amount,
    phone,
    mpesaReceiptNumber: '',
    status: 'pending',
    tier,
    description,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: 'completed' | 'failed',
  mpesaReceiptNumber?: string
): Promise<void> => {
  await setDoc(
    doc(firebaseFirestore, PAYMENTS, paymentId),
    {
      status,
      ...(mpesaReceiptNumber && { mpesaReceiptNumber }),
    },
    { merge: true }
  );
};