'use strict';

const _ = require('lodash');
const logger = require('../logger');

const formatStatusForLogging = (status) => {
  const formatted = {};
  formatted.currentMoment = status.currentMoment.format();
  formatted.roomTemperature = status.roomTemperature;
  formatted.hvacMode = status.hvacMode;
  formatted.currentTemperatureSetting = status.currentTemperatureSetting;
  formatted.holdEnabled = status.holdEnabled;
  formatted.currentTargetTemperature = _.clone(status.currentTargetTemperature);
  formatted.override = {
    temperatureTargetIsOverridden: status.override.temperatureTargetIsOverridden,
    overrideTimerIsExpired: status.override.overrideTimerIsExpired,
    timerExpiryMoment: status.override.timerExpiryMoment
      && status.override.timerExpiryMoment.format()
  };
  return formatted;
};

const logStatusAndDecision = (rawStatus, decision) => {
  const status = formatStatusForLogging(rawStatus);
  logger.info({ status, decision });
};
module.exports = logStatusAndDecision;
