'use strict';

const Promise = require('bluebird');
const moment = require('moment');
const assert = require('assert');
const radiothermostat = require('./radiothermostat');
const logger = require('./src/logger');

const address = process.env.THERMOSTAT_IP;
let delay = parseInt(process.env.POLLING_DELAY, 10);
let overrideExpiryEpoch = 0;

if (address === 'unset' || !address) {
  logger.error('THERMOSTAT_IP address environment variable not set.');
  process.exit(1);
} else {
  logger.info(`Connecting to RadioThermostat at ${address}.`);
}

if (!delay) {
  delay = 3000;
}

const getTemperatureFromThermostatState = (currentThermostatState) => currentThermostatState.temp;
const getHoldStatusFromThermostatState = (currentThermostatState) => {
  if (currentThermostatState.hold === 0) {
    return 'Off';
  }
  if (currentThermostatState.hold === 1) {
    return 'On';
  }
  return 'invalid';
};
const getHeatAcModeFromThermostatState = (currentThermostatState) => {
  if (currentThermostatState.tmode === 0) {
    return 'Off';
  }
  if (currentThermostatState.tmode === 1) {
    return 'Heat';
  }
  if (currentThermostatState.tmode === 2) {
    return 'Cool';
  }
  if (currentThermostatState.tmode === 3) {
    return 'Auto';
  }
  return 'invalid';
};

const isThermostatBeingOverridden = (currentThermostatState) => {
  const heatAcMode = getHeatAcModeFromThermostatState(currentThermostatState);
  if (heatAcMode === 'Heat' && currentThermostatState.t_heat !== 69) {
    if (!overrideExpiryEpoch) {
      overrideExpiryEpoch = moment().add(4, 'hours');
    }
    return true;
  }
  if (heatAcMode === 'Cool' && currentThermostatState.t_cool !== 72) {
    if (!overrideExpiryEpoch) {
      overrideExpiryEpoch = moment().add(4, 'hours');
    }
    return true;
  }
  overrideExpiryEpoch = 0;
  return false;
};
const isOverrideExpired = () => {
  if (moment().isAfter(overrideExpiryEpoch)) {
    return true;
  }
  return false;
};

const queryThermostat = async function () {
  const currentThermostatStateString = await radiothermostat.get.tstat(address);
  const currentThermostatState = JSON.parse(currentThermostatStateString);
  const extractedResult = {
    temperature: getTemperatureFromThermostatState(currentThermostatState),
    hold: getHoldStatusFromThermostatState(currentThermostatState),
    heatAcMode: getHeatAcModeFromThermostatState(currentThermostatState),
    manualOverride: isThermostatBeingOverridden(currentThermostatState),
    overrideExpired: isOverrideExpired()
  };
  // extractedResult.temperature = currentThermostatState.temp;
  // if (currentThermostatState.hold === 0) {
  //   extractedResult.hold = 'Off';
  // }
  // if (currentThermostatState.hold === 1) {
  //   extractedResult.hold = 'On';
  // }
  assert.notEqual(extractedResult.hold, 'invalid');
  assert.notEqual(extractedResult.heatAcMode, 'invalid');
  // if (currentThermostatState.tmode === 0) {
  //   extractedResult.heatAcMode = 'Off';
  // }
  // if (currentThermostatState.tmode === 1) {
  //   extractedResult.heatAcMode = 'Heat';
  // }
  // if (currentThermostatState.tmode === 2) {
  //   extractedResult.heatAcMode = 'Cool';
  // }
  // if (currentThermostatState.tmode === 3) {
  //   extractedResult.heatAcMode = 'Auto';
  // }

  // if (extractedResult.manualOverride) {
  //   if (moment().isAfter(overrideExpiryEpoch)) {
  //     extractedResult.overrideExpired = true;
  //   }
  // } else {
  //   overrideExpiryEpoch = 0;
  // }

  let expiryTime = '.';
  if (overrideExpiryEpoch) {
    expiryTime = `. Expring ${overrideExpiryEpoch.fromNow()}`;
  }
  logger.info(
    `Current Temperature is ${extractedResult.temperature}, mode is ${extractedResult.heatAcMode}, hold is ${
      extractedResult.hold
    }. Time is ${currentThermostatState.time.hour}:${currentThermostatState.time.minute}. Override is ${
      extractedResult.manualOverride
    }, expired is ${extractedResult.overrideExpired}${expiryTime}  ${currentThermostatStateString}`
  );
  return extractedResult;
};

const enforceState = async function (thermostatState) {
  try {
    if (thermostatState.temperature >= 72 && thermostatState.heatAcMode === 'Heat') {
      logger.info('Cooling down the house.');
      await radiothermostat.post.setTargetCooling(address, 72);
      await radiothermostat.post.activateHold(address);
    }
    if (thermostatState.temperature <= 69 && thermostatState.heatAcMode === 'Cool') {
      logger.info('Heating up the house.');
      await radiothermostat.post.setTargetHeat(address, 69);
      await radiothermostat.post.activateHold(address);
    }
    if (thermostatState.manualOverride && thermostatState.overrideExpired) {
      if (thermostatState.heatAcMode === 'Cool') {
        await radiothermostat.post.setTargetCooling(address, 72);
      }
      if (thermostatState.heatAcMode === 'Heat') {
        await radiothermostat.post.setTargetHeat(address, 69);
      }
    }
  } catch (err) {
    logger.error(err);
  }
};

const mainLoop = async function () {
  /* eslint-disable no-await-in-loop */
  while (true) {
    try {
      const thermostatState = await queryThermostat();
      await enforceState(thermostatState);
    } catch (err) {
      logger.error(err);
    }
    await Promise.delay(delay);
  }
  /* eslint-enable no-await-in-loop */
};

mainLoop();
