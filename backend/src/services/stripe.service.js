import stripe from '../config/stripe.js';
import logger from '../utils/logger.js';

class StripeService {
  async createCustomer(user) {
    if (!stripe) {
      logger.warn('Stripe is not configured. Skipping createCustomer.');
      return null;
    }
    
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      return customer;
    } catch (error) {
      logger.error(`Stripe createCustomer error: ${error.message}`);
      return null;
    }
  }

  async createCheckoutSession(plan, user, successUrl, cancelUrl) {
    if (!stripe) {
      logger.warn('Stripe is not configured. Skipping createCheckoutSession.');
      return { url: `${successUrl}?session_id=mock_session` };
    }

    try {
      const session = await stripe.checkout.sessions.create({
        customer: user.stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: user._id.toString(),
          planId: plan._id.toString()
        }
      });
      return session;
    } catch (error) {
      logger.error(`Stripe createCheckoutSession error: ${error.message}`);
      throw error;
    }
  }

  async createPortalSession(customerId, returnUrl) {
    if (!stripe) return { url: returnUrl };
    
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      logger.error(`Stripe createPortalSession error: ${error.message}`);
      throw error;
    }
  }
}

export default new StripeService();
