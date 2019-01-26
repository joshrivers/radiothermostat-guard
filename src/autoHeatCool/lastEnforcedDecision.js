'use strict';

const _ = require('lodash');

let storedDecision;

module.exports = {
  storeEnforcedDecision: (decision) => {
    storedDecision = _.clone(decision);
  },
  getLastEnforcedDecision: () => _.clone(storedDecision)
};
