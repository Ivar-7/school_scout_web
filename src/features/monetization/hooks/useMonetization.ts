import { useState, useEffect, useCallback } from 'react';
import { monetizationApi } from '../api/monetization.api';
import type {
  Subscription,
  Payment,
  SubscriptionTier,
  UserRole,
} from '../types/monetization.types';

const MOCK_USER_ID = 'demo-user-123';
const MOCK_USER_ROLE: UserRole = 'parent';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const userId = MOCK_USER_ID;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await monetizationApi.subscription.get(userId);
      setSubscription(data);
    } catch {
      setError('Failed to load subscription.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const subscribe = async (
    tier: SubscriptionTier,
    amount: number,
    mpesaPhone: string
  ): Promise<boolean> => {
    try {
      setProcessing(true);
      setError(null);

      const paymentId = await monetizationApi.payments.create(
        userId,
        tier,
        amount,
        mpesaPhone,
        `SchoolScout ${tier.charAt(0).toUpperCase() + tier.slice(1)} - 1 Month`
      );

      await monetizationApi.subscription.createOrUpdate(
        userId,
        MOCK_USER_ROLE,
        tier,
        mpesaPhone,
        amount
      );

      await monetizationApi.payments.updateStatus(
        paymentId,
        'completed',
        `MPX${Date.now()}`
      );

      await load();
      return true;
    } catch {
      setError('Payment failed. Please try again.');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const cancel = async (): Promise<void> => {
    try {
      setProcessing(true);
      await monetizationApi.subscription.cancel(userId);
      await load();
    } catch {
      setError('Failed to cancel subscription.');
    } finally {
      setProcessing(false);
    }
  };

  const currentTier = subscription?.tier ?? 'free';
  const isActive = subscription?.status === 'active';
  const isPremium = isActive && currentTier !== 'free';

  return {
    subscription,
    loading,
    error,
    processing,
    currentTier,
    isActive,
    isPremium,
    subscribe,
    cancel,
    refresh: load,
  };
};

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = MOCK_USER_ID;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await monetizationApi.payments.getAll(userId);
        setPayments(data);
      } catch {
        setError('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return { payments, loading, error };
};