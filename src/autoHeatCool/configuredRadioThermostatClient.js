'use strict';

const config = require('../config');
const radiothermostatClientFactory = require('../radiothermostatClient');

const radiothermostatClient = radiothermostatClientFactory(config.thermostatIp);

module.exports = radiothermostatClient;
