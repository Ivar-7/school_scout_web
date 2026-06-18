# Monetization

Subscriptions (parent/school premium tiers) paid for via M-Pesa through
[PayHero](https://payhero.co.ke). There is no client-side payment simulation — every payment goes
through real Cloud Functions.

## Collections (client read-only — writes are Admin-SDK-only via Cloud Functions)

- `subscriptions/{uid}` — `{ userId, role, tier, status, startDate, endDate, updatedAt }`.
- `payments/{id}` — `{ userId, amount, phone, description, status, checkoutRequestID, confirmedVia, confirmedAt, metadata }`.

## Key flow

```
SubscriptionsPage "Pay Now"
  └─► startPayheroPayment Cloud Function (amount, phone, metadata: {type:'subscription', tier, role})
        ├─ creates payments/{id} (status: pending)
        └─ triggers an M-Pesa STK push to the user's phone
  └─► client polls checkPaymentStatus every ~4s (up to 2 min) showing
      "check your phone" while waiting
        └─► payment doc flips to status "paid"
              └─► onPaymentConfirmed Cloud Function activates subscriptions/{uid}
```

- **Cancel** — `cancelSubscription` Cloud Function (the only client-writable path into `subscriptions/`).
- **Expiry** — `expireSubscriptions` scheduled function flips subscriptions past `endDate` to `expired`
  (PayHero has no recurring billing, so renewal is always a fresh payment).
- **Payment history** (`PaymentsPage`) — reads `payments` where `userId == uid`.
