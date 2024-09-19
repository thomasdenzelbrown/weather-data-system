require('dotenv').config();
const kafka = require('kafka-node');
const logger = require('./logger');
const { getDB } = require('../config/db');

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function initializeKafkaConsumer() {
  const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
  const consumer = new kafka.Consumer(
    client,
    [{ topic: process.env.TRANSFORMED_TOPIC, partition: 0 }],
    { autoCommit: true }
  );

  consumer.on('message', async (message) => {
    try {
      const stormData = JSON.parse(message.value);
      logger.info(`Received data from Kafka topic: ${JSON.stringify(stormData)}`);

      stormData.date = getTodayDate();

      const db = getDB();
      const collection = db.collection('stormReports');
      const existingRecord = await collection.findOne({
        time: stormData.time,
        date: stormData.date
      });

      if (existingRecord) {
        logger.info(`Duplicate record found for time: ${stormData.time} on ${stormData.date}. Skipping insert.`);
      } else {
        await collection.insertOne(stormData);
        logger.info('Data saved to MongoDB.');
      }
    } catch (error) {
      logger.error(`Error processing message from Kafka: ${error.message}`);
    }
  });

  consumer.on('error', (err) => {
    logger.error(`Kafka consumer error: ${err.message}`);
  });
}

module.exports = { initializeKafkaConsumer };
