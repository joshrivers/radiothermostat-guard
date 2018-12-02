'use strict';

const assert = require('assert');
const getCurrentStateRequest = require('./getCurrentStateRequest');
const setHeatingModeTargetAndHoldRequest = require('./setHeatingModeTargetAndHoldRequest');
const setCoolingModeTargetAndHoldRequest = require('./setCoolingModeTargetAndHoldRequest');

module.exports = (thermostatAddress) => {
  assert.ok(thermostatAddress, 'Thermostat Client called with no address.');
  return {
    getCurrentState: () => getCurrentStateRequest(thermostatAddress),
    setHeatingModeTargetAndHold:
      (newTarget) => setHeatingModeTargetAndHoldRequest(thermostatAddress, newTarget),
    setCoolingModeTargetAndHold:
      (newTarget) => setCoolingModeTargetAndHoldRequest(thermostatAddress, newTarget)
  };
};
