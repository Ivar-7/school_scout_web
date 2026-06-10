import { Check, X } from 'lucide-react';
import type { Plan, SubscriptionTier } from '../types/monetization.types';

interface BillingCardProps {
  plan: Plan;
  currentTier: SubscriptionTier;
  onSelect: (plan: Plan) => void;
  processing: boolean;
}

export const BillingCard = ({
  plan,
  currentTier,
  onSelect,
  processing,
}: BillingCardProps) => {
  const isCurrent = plan.tier === currentTier;
  const isHighlighted = plan.highlighted;

  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col transition-shadow ${
        isHighlighted
          ? 'border-green-500 shadow-lg shadow-green-100'
          : 'border-gray-200 shadow-sm'
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-heading font-bold text-gray-900 text-lg">
          {plan.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{plan.description}</p>
      </div>

      <div className="mb-6">
        {plan.price === 0 ? (
          <p className="font-heading font-bold text-3xl text-gray-900">Free</p>
        ) : (
          <div className="flex items-end gap-1">
            <p className="font-heading font-bold text-3xl text-gray-900">
              KES {plan.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mb-1">{plan.period}</p>
          </div>
        )}
      </div>

      <div className="space-y-2.5 flex-1 mb-6">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {feature.included ? (
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-green-600" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <X className="w-2.5 h-2.5 text-gray-400" />
              </div>
            )}
            <span
              className={`text-sm ${
                feature.included ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {isCurrent ? (
        <div className="w-full text-center py-2.5 rounded-xl border-2 border-green-600 text-green-700 font-medium text-sm bg-green-50">
          Current Plan
        </div>
      ) : (
        <button
          onClick={() => onSelect(plan)}
          disabled={processing || plan.price === 0}
          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isHighlighted
              ? 'bg-green-700 hover:bg-green-800 text-white'
              : 'border border-green-700 text-green-700 hover:bg-green-50'
          }`}
        >
          {plan.price === 0 ? 'Default Plan' : `Upgrade to ${plan.name}`}
        </button>
      )}
    </div>
  );
};