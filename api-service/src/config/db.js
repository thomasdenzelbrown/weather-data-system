require('dotenv').config();
const { MongoClient } = require('mongodb');
const logger = require('../services/logger');

let db = null;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);
    logger.info(`Connected to MongoDB: ${process.env.MONGO_DB_NAME}`);
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

module.exports = { connectToMongoDB, getDB };
