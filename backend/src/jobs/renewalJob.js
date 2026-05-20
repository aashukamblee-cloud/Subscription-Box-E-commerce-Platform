import cron from 'node-cron';
import Subscription from '../models/Subscription.js';
import notificationService from '../services/notification.service.js';
import logger from '../utils/logger.js';

export const startRenewalJob = () => {
  // Run daily at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    logger.info('Running renewal reminder job...');
    
    try {
      const today = new Date();
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const targetStart = new Date(threeDaysFromNow.setHours(0, 0, 0, 0));
      const targetEnd = new Date(threeDaysFromNow.setHours(23, 59, 59, 999));

      const subscriptions = await Subscription.find({
        status: 'active',
        renewalDate: { $gte: targetStart, $lte: targetEnd }
      });

      for (const sub of subscriptions) {
        await notificationService.sendRenewalReminder(sub);
      }
      
      logger.info(`Processed ${subscriptions.length} renewal reminders`);
    } catch (error) {
      logger.error(`Renewal job error: ${error.message}`);
    }
  });
};
