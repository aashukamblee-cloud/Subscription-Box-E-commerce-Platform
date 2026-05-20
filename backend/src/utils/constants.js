export const ROLES = {
  CUSTOMER: 'customer',
  OPERATOR: 'operator',
  SUPERADMIN: 'superadmin'
};

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing',
  EXPIRED: 'expired'
};

export const SHIPMENT_STATUSES = {
  PENDING: 'pending',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  DELAYED: 'delayed',
  RETURNED: 'returned'
};

export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

export const PRODUCT_CATEGORIES = {
  FITNESS: 'fitness',
  BEAUTY: 'beauty',
  TECH: 'tech',
  FOOD: 'food',
  WELLNESS: 'wellness',
  LIFESTYLE: 'lifestyle'
};

export const NOTIFICATION_TYPES = {
  RENEWAL: 'renewal',
  SHIPMENT: 'shipment',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  SUBSCRIPTION_PAUSED: 'subscription_paused',
  PROMO: 'promo'
};
