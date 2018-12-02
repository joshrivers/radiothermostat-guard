'use strict';

const rp = require('request-promise');

module.exports = (thermostatAddress, newTarget) => rp({
  method: 'POST',
  uri: `http://${thermostatAddress}/tstat`,
  json: true,
  body: { tmode: 2, t_cool: newTarget, hold: 1 }
});
