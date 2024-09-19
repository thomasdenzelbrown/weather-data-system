require('dotenv').config();

const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

let db = null;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(MONGO_DB_NAME);
    console.log(`Connected to MongoDB: ${MONGO_DB_NAME}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('MongoDB not connected');
  }
  return db;
}

module.exports = { connectToMongoDB, getDB };
