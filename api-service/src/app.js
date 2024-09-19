require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./config/db');
const { initializeKafkaConsumer } = require('./services/kafkaConsumer');
const windRoutes = require('./routes/wind');
const logger = require('./services/logger');

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
