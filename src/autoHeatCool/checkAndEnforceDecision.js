'use strict';

const getCurrentAutoStatus = require('./getCurrentAutoStatus');
const makeDecisionFromStatus = require('./makeDecisionFromStatus');
const enforceDecision = require('./enforceDecision');
const logStatusAndDecision = require('./logStatusAndDecision');

const checkAndEnforceDecision = async () => {
  const status = await getCurrentAutoStatus();
  const decision = makeDecisionFromStatus(status);
  logStatusAndDecision(status, decision);
  await enforceDecision(decision);
};
module.exports = checkAndEnforceDecision;
