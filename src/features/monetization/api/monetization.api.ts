import {
  fetchSubscription,
  createOrUpdateSubscription,
  cancelSubscription,
  fetchPayments,
  createPayment,
  updatePaymentStatus,
} from '../services/monetization.service';
import type {
  SubscriptionTier,
  UserRole,
} from '../types/monetization.types';

export const monetizationApi = {
  subscription: {
    get: (userId: string) => fetchSubscription(userId),
    createOrUpdate: (
      userId: string,
      role: UserRole,
      tier: SubscriptionTier,
      mpesaPhone: string,
      amount: number
    ) => createOrUpdateSubscription(userId, role, tier, mpesaPhone, amount),
    cancel: (userId: string) => cancelSubscription(userId),
  },
  payments: {
    getAll: (userId: string) => fetchPayments(userId),
    create: (
      userId: string,
      tier: SubscriptionTier,
      amount: number,
      phone: string,
      description: string
    ) => createPayment(userId, tier, amount, phone, description),
    updateStatus: (
      paymentId: string,
      status: 'completed' | 'failed',
      mpesaReceiptNumber?: string
    ) => updatePaymentStatus(paymentId, status, mpesaReceiptNumber),
  },
};