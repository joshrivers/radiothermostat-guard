'use strict';

const moment = require('moment');
const temperatureTargetSchedule = require('./temperatureTargetSchedule');
const manualOverrideDetector = require('./manualOverrideDetector');

const getHeatAcModeFromThermostatState = (tmode) => {
  switch (tmode) {
    case 0: return 'Off';
    case 1: return 'Heat';
    case 2: return 'Cool';
    case 3: return 'Auto';
    default: return 'Invalid';
  }
};

const getCurrentTemperatureSettingFromThermostatState = (state) => {
  switch (state.tmode) {
    case 1: return state.t_heat;
    case 2: return state.t_cool;
    default: return 0;
  }
};

module.exports = (state) => {
  const status = {};
  status.currentMoment = moment();
  status.roomTemperature = state.temp;
  status.hvacMode = getHeatAcModeFromThermostatState(state.tmode);
  status.currentTemperatureSetting = getCurrentTemperatureSettingFromThermostatState(state);
  status.holdEnabled = (state.hold === 1);
  status.currentTargetTemperature = temperatureTargetSchedule(status.currentMoment);
  status.override = manualOverrideDetector(
    status.hvacMode,
    status.currentTemperatureSetting
  );
  return status;
};
