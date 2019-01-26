'use strict';

const assert = require('assert');
const radiothermostatClient = require('./configuredRadioThermostatClient');
const lastEnforcedDecision = require('./lastEnforcedDecision');

module.exports = async (decision) => {
  if (decision.shouldEnforceChange) {
    assert.ok(decision.hvacMode === 'Heat' || decision.hvacMode === 'Cool', 'Decision must have a valid HVAC Mode.');
    if (decision.hvacMode === 'Heat') {
      await radiothermostatClient.setHeatingModeTargetAndHold(decision.targetTemperature);
    }
    if (decision.hvacMode === 'Cool') {
      await radiothermostatClient.setCoolingModeTargetAndHold(decision.targetTemperature);
    }
    lastEnforcedDecision.storeEnforcedDecision(decision);
  }
};
