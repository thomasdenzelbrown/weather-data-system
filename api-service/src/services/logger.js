const winston = require('winston');
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs/app.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath, level: 'info' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

module.exports = logger;
