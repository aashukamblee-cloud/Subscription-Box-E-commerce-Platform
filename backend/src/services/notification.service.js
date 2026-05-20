import Notification from '../models/Notification.js';
import logger from '../utils/logger.js';
import { NOTIFICATION_TYPES } from '../utils/constants.js';

class NotificationService {
  async createNotification(userId, type, title, message, channel = 'in_app', metadata = {}) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        channel,
        metadata
      });

      // If channel is email, we would integrate SendGrid here
      if (channel === 'email' || process.env.NODE_ENV === 'development') {
        logger.info(`[NOTIFICATION] To: ${userId} | Type: ${type} | Title: ${title}`);
      }

      return notification;
    } catch (error) {
      logger.error(`Failed to create notification: ${error.message}`);
      return null;
    }
  }

  async sendRenewalReminder(subscription) {
    const title = 'Upcoming Subscription Renewal';
    const message = `Your subscription will renew on ${subscription.renewalDate.toDateString()}.`;
    return this.createNotification(subscription.userId, NOTIFICATION_TYPES.RENEWAL, title, message, 'email', { subscriptionId: subscription._id });
  }

  async sendPaymentSuccess(userId, amount) {
    const title = 'Payment Successful';
    const message = `We've successfully processed your payment of $${(amount / 100).toFixed(2)}.`;
    return this.createNotification(userId, NOTIFICATION_TYPES.PAYMENT_SUCCESS, title, message, 'email');
  }

  async sendPaymentFailed(userId) {
    const title = 'Payment Failed';
    const message = `We were unable to process your recent payment. Please update your payment method.`;
    return this.createNotification(userId, NOTIFICATION_TYPES.PAYMENT_FAILED, title, message, 'email');
  }

  async sendShipmentUpdate(userId, shipment) {
    const title = `Shipment Update: ${shipment.status}`;
    const message = `Your box is now marked as ${shipment.status}. Track it using tracking number: ${shipment.trackingNumber}.`;
    return this.createNotification(userId, NOTIFICATION_TYPES.SHIPMENT, title, message, 'email', { shipmentId: shipment._id });
  }
}

export default new NotificationService();
