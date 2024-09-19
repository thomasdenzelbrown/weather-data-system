const express = require('express');
const { getStormData } = require('../services/mongoService');
const logger = require('../services/logger');
const router = express.Router();

router.get('/wind', async (req, res) => {
  try {
    const query = {};

    if (req.query.date) {
      query.date = req.query.date;
    }

    if (req.query.location) {
      query.location = req.query.location;
    }

    const stormData = await getStormData(query);
    if (stormData.length === 0) {
      return res.status(404).json({ message: 'No data found for the specified query.' });
    }

    logger.info(`API request: /wind?date=${req.query.date}&location=${req.query.location}`);

    res.json(stormData);
  } catch (error) {
    logger.error('Error in API request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
