import cron from 'node-cron';
import logger from '../utils/logger.js';

export const startShipmentJob = () => {
  // Run on the 1st of every month at 02:00 AM
  cron.schedule('0 2 1 * *', async () => {
    logger.info('Running monthly shipment generation job...');
    // Implementation placeholder for auto-generating shipments for active subs
  });
};
