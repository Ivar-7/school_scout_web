import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore'
import { callFunction } from '../../../shared/api/httpClient'
import type {
  Subscription,
  Payment,
  SubscriptionTier,
  UserRole,
  PaymentStatus,
} from '../types/monetization.types'

const SUBSCRIPTIONS = 'subscriptions'
const PAYMENTS = 'payments'

// ── Subscription (client: read-only — Cloud Functions own writes) ────────────

export const fetchSubscription = async (userId: string): Promise<Subscription | null> => {
  const ref = doc(firebaseFirestore, SUBSCRIPTIONS, userId)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) return null
  return snapshot.data() as Subscription
}

export const subscribeToSubscription = (
  userId: string,
  onData: (subscription: Subscription | null) => void
): Unsubscribe => {
  return onSnapshot(doc(firebaseFirestore, SUBSCRIPTIONS, userId), (snapshot) => {
    onData(snapshot.exists() ? (snapshot.data() as Subscription) : null)
  })
}

export const cancelSubscription = (): Promise<void> => callFunction('cancelSubscription', {})

// ── Payments ──────────────────────────────────────────────────────────────────

export const fetchPayments = async (userId: string): Promise<Payment[]> => {
  const q = query(
    collection(firebaseFirestore, PAYMENTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Payment[]
}

interface StartPaymentResponse {
  paymentId: string
}

export const startSubscriptionPayment = (
  tier: SubscriptionTier,
  role: UserRole,
  amount: number,
  phoneNumber: string,
  description: string
): Promise<StartPaymentResponse> =>
  callFunction('startPayheroPayment', {
    amount,
    phoneNumber,
    description,
    metadata: { type: 'subscription', tier, role },
  })

interface CheckStatusResponse {
  status: PaymentStatus
}

export const checkPaymentStatus = (paymentId: string): Promise<CheckStatusResponse> =>
  callFunction('checkPaymentStatus', { paymentId })
