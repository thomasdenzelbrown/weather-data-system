const { fetchWindData } = require('./fetcher');
const { publishToKafka } = require('./kafka-producer');
const logger = require('./logger');
const cron = require('node-cron');

// Function to run the data collection process
async function run() {
  try {
    logger.info('Starting data collection service...');

    // Fetch the wind data from NOAA CSV
    const windData = await fetchWindData();

    // Publish the parsed data to Kafka
    await publishToKafka(windData);
    logger.info('Wind data successfully published to Kafka.');
  } catch (error) {
    logger.error('Error in data collection process:', error);
  }
}

// Schedule the task to run 3 times a day: at 6 AM, 12 PM, and 6 PM (server time)
cron.schedule('0 6,12,18 * * *', () => {
  logger.info('Scheduled data collection triggered...');
  run();
});

// Run the service once when it starts
run();
