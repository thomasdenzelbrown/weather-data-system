require('dotenv').config();

const axios = require('axios');
const csv = require('csv-parser');
const logger = require('./logger');
const { Readable } = require('stream');

const CSV_URL = process.env.CSV_URL;

async function fetchWindData() {
  try {
    logger.info('Fetching wind data from NOAA CSV...');

    const response = await axios.get(CSV_URL);

    const stream = Readable.from(response.data);

    const windData = [];

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          windData.push(row);
        })
        .on('end', () => {
          if (windData.length === 0) {
            logger.warn('No wind data available (CSV is empty).');
            resolve(null);
          } else {
            logger.info('CSV parsing complete.');
            resolve(windData);
          }
        })
        .on('error', (error) => {
          logger.error('Error parsing CSV data:', error);
          reject(error);
        });
    });
  } catch (error) {
    logger.error('Error fetching wind data from NOAA:', error);
    throw error;
  }
}

module.exports = { fetchWindData };
