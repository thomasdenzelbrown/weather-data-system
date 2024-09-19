require('dotenv').config();
const express = require('express');
const { connectToMongoDB } = require('./config/db');
const { initializeKafkaConsumer } = require('./services/kafkaConsumer');
const windRoutes = require('./routes/wind');
const logger = require('./services/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', windRoutes);

async function startServer() {
  try {
    await connectToMongoDB();

    initializeKafkaConsumer();

    app.listen(PORT, () => {
      logger.info(`API service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the service:', error);
    process.exit(1);
  }
}

startServer();
