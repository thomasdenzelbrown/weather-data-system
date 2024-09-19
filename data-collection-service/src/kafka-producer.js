const kafka = require('kafka-node');
const logger = require('./logger');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);

async function publishToKafka(data) {
  return new Promise((resolve, reject) => {
    const payloads = [{ topic: 'raw-wind-data', messages: JSON.stringify(data) }];

    producer.send(payloads, (err, data) => {
      if (err) {
        logger.error('Error publishing data to Kafka:', err);
        return reject(err);
      }
      logger.info('Data published to Kafka:', data);
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
