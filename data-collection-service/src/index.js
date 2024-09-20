require('dotenv').config();
const cron = require('node-cron');
const { fetchAndProcessCSV } = require('./fetcher');
const logger = require('./logger');

function handleShutdown() {
  logger.info('Received shutdown signal. Closing resources and exiting...');
  process.exit(0);
}

async function runDataFetchJob() {
  try {
    logger.info('Fetching data from NOAA...');
    
    await fetchAndProcessCSV();

    logger.info('Data fetching and processing completed successfully.');
  } catch (error) {
    logger.error('Error in Data Collection Service:', error);
  }
}

cron.schedule('0 8,14,20 * * *', () => {
  logger.info('Scheduled job started: Fetching data...');
  runDataFetchJob();
});

runDataFetchJob();

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
