import { useState } from 'react';
import { useSubscription } from '../hooks/useMonetization';
import { BillingCard } from '../components/BillingCard';
import { Shield, X, Phone, AlertCircle } from 'lucide-react';
import type { Plan, SubscriptionTier } from '../types/monetization.types';
import { PARENT_PLANS, SCHOOL_PLANS } from '../types/monetization.types';
import type { Subscription } from '../types/monetization.types';

const PaymentModal = ({
  plan,
  onClose,
  onConfirm,
  processing,
}: {
  plan: Plan;
  onClose: () => void;
  onConfirm: (phone: string) => void;
  processing: boolean;
}) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    return /^(?:\+254|0)[17]\d{8}$/.test(cleaned);
  };

  const handleConfirm = () => {
    if (!validatePhone(phone)) {
      setError('Enter a valid Kenyan phone number (e.g. 0712345678)');
      return;
    }
    setError('');
    onConfirm(phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-gray-900">
            Pay with M-Pesa
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Plan</span>
              <span className="font-semibold text-gray-900">{plan.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-bold text-green-700">
                KES {plan.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                placeholder="0712 345 678"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 ${
                  error ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              You will receive an M-Pesa prompt on this number to complete
              payment.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing || !phone.trim()}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CancelModal = ({
  onClose,
  onConfirm,
  processing,
}: {
  onClose: () => void;
  onConfirm: () => void;
  processing: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
      <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2">
        Cancel Subscription?
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        You will lose access to premium features at the end of your current
        billing period. You can resubscribe anytime.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
        >
          Keep Plan
        </button>
        <button
          onClick={onConfirm}
          disabled={processing}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {processing ? 'Cancelling...' : 'Cancel Plan'}
        </button>
      </div>
    </div>
  </div>
);

export default function SubscriptionsPage() {
  const {
    subscription,
    loading,
    error,
    processing,
    currentTier,
    isPremium,
    subscribe,
    cancel,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'parent' | 'school'>('parent');

  const plans = activeTab === 'parent' ? PARENT_PLANS : SCHOOL_PLANS;

  const handleSelectPlan = (plan: Plan) => {
    if (plan.price === 0) return;
    setSelectedPlan(plan);
  };

  const handlePayment = async (phone: string) => {
    if (!selectedPlan) return;
    const success = await subscribe(selectedPlan.tier, selectedPlan.price, phone);
    if (success) {
      setSelectedPlan(null);
      setSuccessMsg(`Successfully upgraded to ${selectedPlan.name}!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleCancel = async () => {
    await cancel();
    setShowCancel(false);
    setSuccessMsg('Subscription cancelled. You retain access until end of period.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const formatDate = (timestamp: Subscription['endDate'] | undefined) => {
    if (!timestamp) return '—';
    try {
      return timestamp.toDate().toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Plans & Billing
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your SchoolScout subscription
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Success message */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
            {successMsg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Current plan banner */}
        {!loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Current Plan:{' '}
                    <span className="text-green-700 capitalize">{currentTier}</span>
                  </p>
                  {subscription && subscription.status === 'active' && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Renews on {formatDate(subscription.endDate)}
                    </p>
                  )}
                  {subscription && subscription.status === 'cancelled' && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      Cancelled — access until {formatDate(subscription.endDate)}
                    </p>
                  )}
                </div>
              </div>
              {isPremium && subscription?.status === 'active' && (
                <button
                  onClick={() => setShowCancel(true)}
                  className="text-sm text-red-600 hover:underline font-medium"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab toggle */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(['parent', 'school'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'parent' ? 'For Parents' : 'For Schools'}
            </button>
          ))}
        </div>

        {/* Plans grid */}
        <div
          className={`grid gap-6 ${
            plans.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 max-w-2xl'
          }`}
        >
          {plans.map((plan) => (
            <BillingCard
              key={plan.tier}
              plan={plan}
              currentTier={currentTier as SubscriptionTier}
              onSelect={handleSelectPlan}
              processing={processing}
            />
          ))}
        </div>

        {/* M-Pesa note */}
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Payments via M-Pesa
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              All payments are processed securely through M-Pesa. You will
              receive an STK push prompt on your phone to complete payment.
              Subscriptions renew monthly and can be cancelled anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onConfirm={handlePayment}
          processing={processing}
        />
      )}

      {/* Cancel modal */}
      {showCancel && (
        <CancelModal
          onClose={() => setShowCancel(false)}
          onConfirm={handleCancel}
          processing={processing}
        />
      )}
    </div>
  );
}

