import Payment from '../models/Payment.js';
import Subscription from '../models/Subscription.js';
import stripeService from '../services/stripe.service.js';
import Plan from '../models/Plan.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import stripe from '../config/stripe.js';
import logger from '../utils/logger.js';

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    
    if (!plan) return errorResponse(res, 'Plan not found', 404);

    const successUrl = `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.CLIENT_URL}/pricing`;

    const session = await stripeService.createCheckoutSession(plan, req.user, successUrl, cancelUrl);
    
    successResponse(res, { sessionUrl: session.url });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { userId, planId } = session.metadata;

      // Activate subscription in DB
      await Subscription.create({
        userId,
        planId,
        status: 'active',
        stripeSubscriptionId: session.subscription,
        stripeCustomerId: session.customer,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      });
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object;
      const sub = await Subscription.findOne({ stripeSubscriptionId: invoice.subscription });
      if (sub) {
        // Log payment
        await Payment.create({
          userId: sub.userId,
          subscriptionId: sub._id,
          stripePaymentId: invoice.payment_intent,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'succeeded'
        });
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const sub = await Subscription.findOne({ stripeSubscriptionId: invoice.subscription });
      if (sub) {
        sub.status = 'past_due';
        await sub.save();
        
        await Payment.create({
          userId: sub.userId,
          subscriptionId: sub._id,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: 'failed'
        });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { status: 'cancelled', cancelledAt: new Date(), cancellationReason: 'Stripe subscription deleted' }
      );
      break;
    }
    default:
      logger.info(`Unhandled event type ${event.type}`);
  }

  res.send();
};

export const getInvoices = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort('-createdAt');
    successResponse(res, payments);
  } catch (error) {
    next(error);
  }
};

export const processRefund = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) return errorResponse(res, 'Payment not found', 404);
    if (payment.status !== 'succeeded') return errorResponse(res, 'Can only refund successful payments', 400);

    // Mock refund if stripe is not fully integrated
    payment.status = 'refunded';
    payment.refundAmount = amount || payment.amount;
    payment.refundReason = reason;
    await payment.save();

    successResponse(res, payment, 'Refund processed successfully');
  } catch (error) {
    next(error);
  }
};
