require('dotenv').config();  // Load environment variables

const express = require('express');
const { connectToMongoDB } = require('./config/db');
const windRoutes = require('./routes/wind');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', windRoutes);

app.listen(PORT, async () => {
  try {
    await connectToMongoDB();
    console.log(`API server is running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
});
