'use strict';

const Promise = require('bluebird');
const config = require('../config');
const checkAndEnforceDecision = require('./checkAndEnforceDecision');
const logger = require('../logger');

const delay = config.pollingDelay;
let continueRunning = true;

const mainLoop = async function () {
  /* eslint-disable no-await-in-loop */
  while (continueRunning) {
    try {
      await checkAndEnforceDecision();
    } catch (err) {
      logger.error(err);
    }
    await Promise.delay(delay);
  }
  /* eslint-enable no-await-in-loop */
};

const terminate = () => {
  continueRunning = false;
};

module.exports = { mainLoop, terminate };
