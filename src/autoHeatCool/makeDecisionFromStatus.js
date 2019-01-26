'use strict';

const makeDecisionFromStatus = (thermostatStatus) => {
  const decision = {};
  decision.shouldEnforceChange = false;
  decision.targetTemperature = thermostatStatus.currentTemperatureSetting;
  decision.hvacMode = thermostatStatus.hvacMode;
  if (thermostatStatus.roomTemperature > thermostatStatus.currentTargetTemperature.Cool
    && thermostatStatus.hvacMode !== 'Cool'
    && thermostatStatus.currentTemperatureSetting
      !== thermostatStatus.currentTargetTemperature.Cool) {
    decision.reason = 'Temp too high';
    decision.shouldEnforceChange = true;
    decision.targetTemperature = thermostatStatus.currentTargetTemperature.Cool;
    decision.hvacMode = 'Cool';
  }
  if (thermostatStatus.roomTemperature < thermostatStatus.currentTargetTemperature.Heat
    && thermostatStatus.hvacMode !== 'Heat'
    && thermostatStatus.currentTemperatureSetting
      !== thermostatStatus.currentTargetTemperature.Heat) {
    decision.reason = 'Temp too low';
    decision.shouldEnforceChange = true;
    decision.targetTemperature = thermostatStatus.currentTargetTemperature.Heat;
    decision.hvacMode = 'Heat';
  }
  if (thermostatStatus.override.temperatureTargetIsOverridden
      && thermostatStatus.override.overrideTimerIsExpired) {
    decision.reason = 'Override expired';
    decision.shouldEnforceChange = true;
    decision.targetTemperature = thermostatStatus
      .currentTargetTemperature[thermostatStatus.hvacMode];
    decision.hvacMode = thermostatStatus.hvacMode;
  }
  return decision;
};
module.exports = makeDecisionFromStatus;
