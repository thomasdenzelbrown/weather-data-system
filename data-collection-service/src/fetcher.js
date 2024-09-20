require('dotenv').config();

const axios = require('axios');
const csv = require('csv-parser');
const logger = require('./logger');
const { Writable } = require('stream');
const { publishToKafka } = require('./kafka-producer');

const CSV_URL = process.env.CSV_URL;
const BATCH_SIZE = process.env.BATCH_SIZE;

async function fetchAndProcessCSV() {
  try {
    logger.info(`Fetching large CSV data from: ${CSV_URL}`);

    const response = await axios({
      method: 'get',
      url: CSV_URL,
      responseType: 'stream'
    });

    let processedCount = 0;
    let batch = [];

    return new Promise((resolve, reject) => {
      response.data
        .pipe(csv())
        .pipe(new Writable({
          objectMode: true,
          write: async (row, encoding, callback) => {
            try {
              processedCount++;
              batch.push(row);

              if (batch.length === BATCH_SIZE) {
                await publishBatchToKafka(batch);
                batch = [];
              }

              callback();
            } catch (error) {
              logger.error('Error processing CSV row:', error);
              callback(error);
            }
          }
        }))
        .on('finish', async () => {
          if (batch.length > 0) {
            await publishBatchToKafka(batch);
          }

          logger.info(`CSV processing complete. Processed ${processedCount} rows.`);
          resolve();
        })
        .on('error', (error) => {
          logger.error('Error during CSV processing:', error);
          reject(error);
        });
    });
  } catch (error) {
    logger.error('Error fetching CSV data:', error);
    throw error;
  }
}

async function publishBatchToKafka(batch) {
  try {
    logger.info(`Publishing batch of ${batch.length} rows to Kafka...`);
    await publishToKafka(batch);
    logger.info('Batch successfully published to Kafka');
  } catch (err) {
    logger.error('Error publishing batch to Kafka:', err);
  }
}

module.exports = { fetchAndProcessCSV };
