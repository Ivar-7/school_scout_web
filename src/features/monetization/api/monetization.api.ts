import {
  fetchSubscription,
  subscribeToSubscription,
  cancelSubscription,
  fetchPayments,
  startSubscriptionPayment,
  checkPaymentStatus,
} from '../services/monetization.service'
import type { SubscriptionTier, UserRole } from '../types/monetization.types'

export const monetizationApi = {
  subscription: {
    get: (userId: string) => fetchSubscription(userId),
    subscribeToChanges: subscribeToSubscription,
    cancel: () => cancelSubscription(),
  },
  payments: {
    getAll: (userId: string) => fetchPayments(userId),
    start: (
      tier: SubscriptionTier,
      role: UserRole,
      amount: number,
      phoneNumber: string,
      description: string
    ) => startSubscriptionPayment(tier, role, amount, phoneNumber, description),
    checkStatus: (paymentId: string) => checkPaymentStatus(paymentId),
  },
}
