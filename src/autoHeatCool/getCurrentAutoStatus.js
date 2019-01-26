'use strict';

const radiothermostatClient = require('./configuredRadioThermostatClient');
const calculateStatusFromThermostatState = require('./calculateStatusFromThermostatState');

const getCurrentAutoStatus = async () => {
  const thermostatState = await radiothermostatClient.getCurrentState();
  return calculateStatusFromThermostatState(thermostatState);
};
module.exports = getCurrentAutoStatus;
