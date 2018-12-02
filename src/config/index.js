'use strict';

const environment = require('./environmentVariables');
const processWrapper = require('./processWrapper');
const logger = require('../logger');

const generateConfig = () => {
  if (!environment.thermostatIp || environment.thermostatIp === 'unset') {
    logger.error('Missing Thermostat IP Environment Variable.');
    processWrapper.exit(1);
  }
  let parsedPollingDelay = parseInt(environment.pollingDelay, 10);
  if (Number.isNaN(parsedPollingDelay)) {
    logger.info('Using default Polling Delay, since Environment value is invalid.');
    parsedPollingDelay = 3000;
  }
  return ({
    thermostatIp: environment.thermostatIp,
    pollingDelay: parsedPollingDelay
  });
};
module.exports = generateConfig();
