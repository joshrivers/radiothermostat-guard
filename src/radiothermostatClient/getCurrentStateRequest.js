'use strict';

const rp = require('request-promise');

module.exports = (thermostatAddress) => rp({
  json: true,
  uri: `http://${thermostatAddress}/tstat`
});
