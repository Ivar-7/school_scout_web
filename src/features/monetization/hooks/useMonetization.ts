import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { monetizationApi } from '../api/monetization.api'
import type { Subscription, Payment, SubscriptionTier } from '../types/monetization.types'

const POLL_INTERVAL_MS = 4000
const POLL_TIMEOUT_MS = 120_000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useSubscription = () => {
  const { user, profile } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [awaitingMpesa, setAwaitingMpesa] = useState(false)

  useEffect(() => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = monetizationApi.subscription.subscribeToChanges(user.uid, (data) => {
      setSubscription(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const subscribe = async (
    tier: SubscriptionTier,
    amount: number,
    mpesaPhone: string
  ): Promise<boolean> => {
    if (!user) return false
    try {
      setProcessing(true)
      setError(null)
      const { paymentId } = await monetizationApi.payments.start(
        tier,
        profile?.role ?? 'parent',
        amount,
        mpesaPhone,
        `School Finder ${tier.charAt(0).toUpperCase() + tier.slice(1)} - 1 Month`
      )

      setAwaitingMpesa(true)
      const deadline = Date.now() + POLL_TIMEOUT_MS
      while (Date.now() < deadline) {
        await sleep(POLL_INTERVAL_MS)
        const { status } = await monetizationApi.payments.checkStatus(paymentId)
        if (status === 'paid') return true
        if (status === 'failed' || status === 'cancelled') {
          setError('Payment was not completed. Please try again.')
          return false
        }
      }
      setError('We did not receive confirmation in time. Check Payments for the latest status.')
      return false
    } catch {
      setError('Payment failed. Please try again.')
      return false
    } finally {
      setProcessing(false)
      setAwaitingMpesa(false)
    }
  }

  const cancel = async (): Promise<void> => {
    try {
      setProcessing(true)
      setError(null)
      await monetizationApi.subscription.cancel()
    } catch {
      setError('Failed to cancel subscription.')
    } finally {
      setProcessing(false)
    }
  }

  const currentTier = subscription?.tier ?? 'free'
  const isActive = subscription?.status === 'active'
  const isPremium = isActive && currentTier !== 'free'

  return {
    subscription,
    loading,
    error,
    processing,
    awaitingMpesa,
    currentTier,
    isActive,
    isPremium,
    subscribe,
    cancel,
  }
}

export const usePayments = () => {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) {
      setPayments([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await monetizationApi.payments.getAll(user.uid)
      setPayments(data)
    } catch {
      setError('Failed to load payment history.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  return { payments, loading, error, refresh: load }
}
