'use strict';

const moment = require('moment');

let overrideTimer;

const scheduleIsOverriddenIsTimerExpiredʔ = () => {
  if (overrideTimer) {
    const currentTime = moment();
    return currentTime.isAfter(overrideTimer);
  }
  overrideTimer = moment().add(4, 'hours');
  return false;
};
const getCurrentOverrideTimer = () => {
  if (overrideTimer) {
    return overrideTimer.clone();
  }
  return overrideTimer;
};
const clearOverrideTimer = () => {
  overrideTimer = undefined;
};
module.exports = {
  scheduleIsOverriddenIsTimerExpiredʔ,
  getCurrentOverrideTimer,
  clearOverrideTimer
};
