const { getDB } = require('../config/db');

async function getStormData(query) {
  const db = getDB();
  const collection = db.collection('stormReports');

  const stormData = await collection.find(query).toArray();
  return stormData;
}

module.exports = { getStormData };
