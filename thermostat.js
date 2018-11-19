'use strict';

const rtstat = require('rtstat');
const _ = require('lodash');
const logger = require('./src/logger');

module.exports = rtstat
  .findThermostats()
  .then((thermostats) => {
    logger.info(thermostats);
    let foundThermostat = {};
    _.each(thermostats, (thermostat, id) => {
      logger.info(`Thermostat ${id} found at ${thermostat.ipAddress}`);
      foundThermostat = rtstat.tstat(thermostat.ipAddress);
    });
    return foundThermostat;
  });


// rtstat
//   .findThermostats()
//   .then((thermostats)=>{
//     console.log(thermostats);
//     _.each(thermostats, (thermostat, id)=>{
//       console.log(`Thermostat ${id} found at ${thermostat.ipAddress}`);
//       module.exports.thermostat = rtstat.tstat(thermostat.ipAddress)
//     });
//   })
//   .catch(console.err);
