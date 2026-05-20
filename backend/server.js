import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { startRenewalJob } from './src/jobs/renewalJob.js';
import { startShipmentJob } from './src/jobs/shipmentJob.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start Express
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
    // Start Cron Jobs
    startRenewalJob();
    startShipmentJob();
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use. Please run 'taskkill /F /IM node.exe' on Windows to kill zombie processes, then restart.`);
      process.exit(1);
    } else {
      logger.error(`Server error: ${e.message}`);
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing server gracefully.');
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  });
}).catch(err => {
  logger.error(`Failed to connect to database: ${err.message}`);
  process.exit(1);
});
