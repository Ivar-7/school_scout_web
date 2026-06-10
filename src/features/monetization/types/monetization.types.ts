import { Timestamp } from 'firebase/firestore';

export type SubscriptionTier = 'free' | 'premium' | 'featured';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type UserRole = 'parent' | 'school';

export interface Subscription {
  userId: string;
  role: UserRole;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  mpesaPhone: string;
  amount: number;
  startDate: Timestamp;
  endDate: Timestamp;
  autoRenew: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  phone: string;
  mpesaReceiptNumber: string;
  status: PaymentStatus;
  tier: SubscriptionTier;
  description: string;
  createdAt: Timestamp;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  highlighted: boolean;
}

export const PARENT_PLANS: Plan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    period: 'Forever',
    description: 'Get started with basic school discovery',
    highlighted: false,
    features: [
      { text: 'Browse all school profiles', included: true },
      { text: 'View school fees & facilities', included: true },
      { text: 'Contact up to 3 schools/month', included: true },
      { text: 'Save up to 10 schools', included: true },
      { text: 'Read reviews', included: true },
      { text: 'Unlimited school contacts', included: false },
      { text: 'School comparison tool', included: false },
      { text: 'Document vault', included: false },
      { text: 'Application tracker', included: false },
      { text: 'Admission deadline alerts', included: false },
    ],
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: 499,
    period: 'per month',
    description: 'Everything you need to find the perfect school',
    highlighted: true,
    features: [
      { text: 'Browse all school profiles', included: true },
      { text: 'View school fees & facilities', included: true },
      { text: 'Unlimited school contacts', included: true },
      { text: 'Unlimited shortlisting', included: true },
      { text: 'Read & write reviews', included: true },
      { text: 'School comparison tool', included: true },
      { text: 'Document vault', included: true },
      { text: 'Application tracker', included: true },
      { text: 'Admission deadline alerts', included: true },
      { text: 'Priority support', included: true },
    ],
  },
];

export const SCHOOL_PLANS: Plan[] = [
  {
    tier: 'free',
    name: 'Basic Listing',
    price: 0,
    period: 'Forever',
    description: 'Get your school found by parents',
    highlighted: false,
    features: [
      { text: 'School profile page', included: true },
      { text: 'Up to 5 photos', included: true },
      { text: 'Receive parent enquiries', included: true },
      { text: 'Basic school info', included: true },
      { text: 'Unlimited photos & videos', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Application management', included: false },
      { text: 'Featured in search results', included: false },
      { text: 'Competitor benchmarking', included: false },
    ],
  },
  {
    tier: 'premium',
    name: 'Premium Profile',
    price: 6000,
    period: 'per month',
    description: 'Stand out and manage admissions digitally',
    highlighted: true,
    features: [
      { text: 'Full school profile page', included: true },
      { text: 'Unlimited photos & videos', included: true },
      { text: 'Receive parent enquiries', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Application management', included: true },
      { text: 'Priority search placement', included: true },
      { text: 'Response templates', included: true },
      { text: 'Competitor benchmarking', included: true },
      { text: 'Verified badge eligibility', included: true },
    ],
  },
  {
    tier: 'featured',
    name: 'Featured',
    price: 10000,
    period: 'per month',
    description: 'Maximum visibility and all premium tools',
    highlighted: false,
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Featured badge on profile', included: true },
      { text: 'Top of all search results', included: true },
      { text: 'Homepage featured slot', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SMS blast to enquiring parents', included: true },
      { text: 'Monthly performance report', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'Custom analytics reports', included: true },
    ],
  },
];