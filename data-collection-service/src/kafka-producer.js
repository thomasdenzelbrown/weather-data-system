require('dotenv').config();

const kafka = require('kafka-node');
const logger = require('./logger');

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const RAW_TOPIC = process.env.RAW_TOPIC;

const client = new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER });
const producer = new kafka.Producer(client, { requireAcks: 1 });

async function publishToKafka(batch) {
  return new Promise((resolve, reject) => {
    const payloads = batch.map(row => ({
      topic: RAW_TOPIC,
      messages: JSON.stringify(row),
    }));

    producer.send(payloads, (err, data) => {
      if (err) {
        logger.error('Error publishing data to Kafka:', err);
        return reject(err);
      }
      logger.info('Data successfully published to Kafka:');
      resolve(data);
    });
  });
}

producer.on('ready', () => {
  logger.info('Kafka Producer is ready.');
});

producer.on('error', (err) => {
  logger.error('Kafka Producer error:', err);
});

module.exports = { publishToKafka };
