const express = require('express');
const { getWindData } = require('../services/mongoService');
const router = express.Router();

router.get('/wind', async (req, res) => {
  try {
    const query = {};
    if (req.query.location) query.location = req.query.location;
    if (req.query.date) query.time = req.query.date;
    if (req.query.severity) query.severity = req.query.severity;

    const windData = await getWindData(query);

    if (windData.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.json(windData);
  } catch (error) {
    console.error('Error fetching wind data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
