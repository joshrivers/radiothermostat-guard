'use strict';

const lastEnforcedDecision = require('./lastEnforcedDecision');
const manualOverrideTimer = require('./manualOverrideTimer');

/**
 * @param {string} hvacMode - Heat | Cool
 * @param {number} currentTemperatureSetting - current temperature setting in degrees fahrenheit
 * @return {object} {
 *                    temperatureTargetIsOverridden: {bool} - true if override is in place
 *                    overrideTimerIsExpired: {bool} - true if timer is expired
 *                    timerExpiryMoment: {moment} - clone of internal timer moment for formatting
 *                  }
 */
const manualOverrideDetector = (hvacMode, currentTemperatureSetting) => {
  const lastDecision = lastEnforcedDecision.getLastEnforcedDecision();
  if (!lastDecision) {
    manualOverrideTimer.clearOverrideTimer();
    return { temperatureTargetIsOverridden: true, overrideTimerIsExpired: true };
  }
  const temperatureTargetIsOverridden = !(lastDecision.hvacMode === hvacMode
    && lastDecision.targetTemperature === currentTemperatureSetting);
  const result = { temperatureTargetIsOverridden };
  if (temperatureTargetIsOverridden) {
    result.overrideTimerIsExpired = manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ();
    result.timerExpiryMoment = manualOverrideTimer.getCurrentOverrideTimer();
  } else {
    manualOverrideTimer.clearOverrideTimer();
    result.overrideTimerIsExpired = false;
  }
  return result;
};
module.exports = manualOverrideDetector;
