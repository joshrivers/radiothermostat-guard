const rtstat = require('rtstat');
const _ = require('lodash');

module.exports = rtstat
  .findThermostats()
  .then((thermostats)=>{
    console.log(thermostats);
    var foundThermostat = {};
    _.each(thermostats, (thermostat, id)=>{
      console.log(`Thermostat ${id} found at ${thermostat.ipAddress}`);
      foundThermostat = rtstat.tstat(thermostat.ipAddress)
    });
    return foundThermostat;
  })


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
