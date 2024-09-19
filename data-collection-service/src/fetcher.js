const axios = require('axios');
const csv = require('csv-parser');
const logger = require('./logger');
const { Readable } = require('stream');

// URL for the CSV file
const CSV_URL = 'https://www.spc.noaa.gov/climo/reports/today_wind.csv';

// Function to fetch and parse the CSV data
async function fetchWindData() {
  try {
    logger.info('Fetching wind data from NOAA CSV...');

    // Fetch the CSV file using Axios
    const response = await axios.get(CSV_URL);

    // Convert the CSV content to a readable stream
    const stream = Readable.from(response.data);

    // Array to store parsed data
    const windData = [];

    // Parse the CSV content using csv-parser
    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          // Each row will be parsed here
          windData.push(row);
        })
        .on('end', () => {
          logger.info('CSV parsing complete.');
          resolve(windData);  // Return parsed data
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
