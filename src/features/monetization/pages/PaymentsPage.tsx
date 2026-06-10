import { usePayments } from '../hooks/useMonetization';
import { Receipt, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { ElementType } from 'react';

type PaymentStatus = 'pending' | 'completed' | 'failed';

interface StatusConfig {
  icon: ElementType;
  color: string;
  bg: string;
  label: string;
}

const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Completed',
  },
  pending: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    label: 'Pending',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Failed',
  },
};

const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-20" />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Receipt className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2">
      No payments yet
    </h3>
    <p className="text-gray-500 text-sm max-w-sm">
      Your payment history will appear here once you subscribe to a plan.
    </p>
  </div>
);

export default function PaymentsPage() {
  const { payments, loading, error } = usePayments();

  const formatDate = (
    timestamp: { toDate?: () => Date } | null | undefined
  ) => {
    try {
      return timestamp
        ?.toDate?.()
        .toLocaleDateString('en-KE', {
          day: '2-digit',
          month: 'short',
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Payment History
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            All your SchoolScout transactions
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading && (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          )}

          {!loading && payments.length === 0 && <EmptyState />}

          {!loading && payments.length > 0 && (
            <>
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <div className="col-span-2">Description</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Date</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {payments.map((payment) => {
                  const status = payment.status as PaymentStatus;
                  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
                  const Icon = config.icon;
                  return (
                    <div
                      key={payment.id}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 px-4 py-4 items-center"
                    >
                      {/* Description */}
                      <div className="sm:col-span-2 flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}
                        >
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.description}
                          </p>
                          {payment.mpesaReceiptNumber && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Ref: {payment.mpesaReceiptNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          KES {payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 sm:hidden">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}