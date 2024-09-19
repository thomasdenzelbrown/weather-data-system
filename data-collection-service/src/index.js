const { fetchWindData } = require('./fetcher');
const { publishToKafka } = require('./kafka-producer');
const logger = require('./logger');

async function run() {
  try {
    logger.info('Starting data collection service...');

    const windData = await fetchWindData();

    if (!windData) {
      logger.warn('No data to publish, skipping Kafka publication.');
      return;
    }

    await publishToKafka(windData);
    logger.info('Wind data successfully published to Kafka.');
  } catch (error) {
    logger.error('Error in data collection process:', error);
  }
}

run();
