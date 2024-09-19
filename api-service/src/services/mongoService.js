const { getDB } = require('../config/db');

async function getWindData(query) {
  const db = getDB();
  const collection = db.collection('windReports');

  const windData = await collection.find(query).toArray();
  return windData;
}

module.exports = { getWindData };
