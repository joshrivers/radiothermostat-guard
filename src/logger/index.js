'use strict';

const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
  transports: [new winston.transports.Console()]
});

process.on('unhandledRejection', (error) => {
  logger.error('unhandledRejection', error);
});

module.exports = logger;
