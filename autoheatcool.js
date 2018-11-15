'use strict';

const radiothermostat = require('./radiothermostat');
const Promise = require('bluebird');
const moment = require('moment');
const assert = require('assert');
let address = process.env.THERMOSTAT_IP;
let delay = parseInt(process.env.POLLING_DELAY);
let overrideExpiryEpoch = 0;

if (address === 'unset' || !address) {
  console.error('THERMOSTAT_IP address environment variable not set.');
  process.exit(1);
} else {
  console.log(`Connecting to RadioThermostat at ${address}.`);
}

if (!delay) {
  delay = 3000;
}

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('unhandledRejection', error);
});

const getTemperatureFromThermostatState = currentThermostatState => {
  return currentThermostatState.temp;
};
const getHoldStatusFromThermostatState = currentThermostatState => {
  if (currentThermostatState.hold === 0) {
    return 'Off';
  }
  if (currentThermostatState.hold === 1) {
    return 'On';
  }
  return 'invalid';
};
const getHeatAcModeFromThermostatState = currentThermostatState => {
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

const isThermostatBeingOverridden = currentThermostatState => {
  const heatAcMode = getHeatAcModeFromThermostatState(currentThermostatState);
  if (heatAcMode === 'Heat' && currentThermostatState.t_heat != 68) {
    if (!overrideExpiryEpoch) {
      overrideExpiryEpoch = moment().add(4, 'hours');
    }
    return true;
  }
  if (heatAcMode === 'Cool' && currentThermostatState.t_cool != 72) {
    if (!overrideExpiryEpoch) {
      overrideExpiryEpoch = moment().add(4, 'hours');
    }
    return true;
  }
  overrideExpiryEpoch = 0;
  return false;
};
const isOverrideExpired = currentThermostatState => {
  if (moment().isAfter(overrideExpiryEpoch)) {
    return true;
  }
};

const queryThermostat = async function() {
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
  console.log(
    `Current Temperature is ${extractedResult.temperature}, mode is ${extractedResult.heatAcMode}, hold is ${extractedResult.hold}. Time is ${currentThermostatState
      .time.hour}:${currentThermostatState.time
      .minute}. Override is ${extractedResult.manualOverride}, expired is ${extractedResult.overrideExpired}${expiryTime}  ${currentThermostatStateString}`
  );
  return extractedResult;
};

const enforceState = async function(thermostatState) {
  try {
    if (thermostatState.temperature >= 72 && thermostatState.heatAcMode === 'Heat') {
      console.log('Cooling down the house.');
      await radiothermostat.post.setTargetCooling(address, 72);
      await radiothermostat.post.activateHold(address);
    }
    if (thermostatState.temperature <= 68 && thermostatState.heatAcMode === 'Cool') {
      console.log('Heating up the house.');
      await radiothermostat.post.setTargetHeat(address, 68);
      await radiothermostat.post.activateHold(address);
    }
    if (thermostatState.manualOverride && thermostatState.overrideExpired) {
      if (thermostatState.heatAcMode === 'Cool') {
        await radiothermostat.post.setTargetCooling(address, 72);
      }
      if (thermostatState.heatAcMode === 'Heat') {
        await radiothermostat.post.setTargetHeat(address, 68);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const mainLoop = async function() {
  while (true) {
    try {
      const thermostatState = await queryThermostat();
      await enforceState(thermostatState);
    } catch (err) {
      console.error(err);
    }
    await Promise.delay(delay);
  }
};

mainLoop();
