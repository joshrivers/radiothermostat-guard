'use strict';

const rp = require('request-promise');

const createPostOptions = function (url, body) {
  return {
    method: 'POST',
    uri: url,
    body,
    json: true,
  };
};
const requestPost = function (url, body) {
  // console.log(`Posting to ${url}`);
  return rp(createPostOptions(url, body));
  // return rp(createPostOptions(url, body))
  //     .then(result => {
  //         console.log(result);
  //         return result;
  //     })
  //     .catch(err => {
  //         console.error(err);
  //         throw err;
  //     });
};

module.exports.activateHold = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { hold: 1 });

module.exports.removeHold = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { hold: 0 });

module.exports.setTargetHeat = (thermostatIpAddress, newHeatingTemperature) => requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 1, t_heat: newHeatingTemperature });

module.exports.setTargetCooling = (thermostatIpAddress, newCoolingTemperature) => requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 2, t_cool: newCoolingTemperature });

module.exports.setAutoHeatCool = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 3 });

module.exports.setHeatCoolOff = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 0 });

module.exports.setAirConditioningOn = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 2 });

module.exports.setFurnaceOn = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 1 });

module.exports.setFanAuto = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { fmode: 0 });

module.exports.setFanOn = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { fmode: 2 });

module.exports.setFanCirculate = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 1 });

module.exports.reboot = (thermostatIpAddress) => requestPost(`http://${thermostatIpAddress}/sys/command`, { command: 'reboot' });

module.exports.sys_mode = (thermostatIpAddress, preferredMode) => {
  if (preferredMode === 'Normal') {
    return requestPost(`http://${thermostatIpAddress}/sys/mode`, { mode: 1 });
  }
  if (preferredMode === 'Provisioning') {
    return requestPost(`http://${thermostatIpAddress}/sys/mode`, { mode: 0 });
  }
  return Promise.reject(new Error('Specified mode not recognized'));
};

module.exports.sys_name = (thermostatIpAddress, newName) => requestPost(`http://${thermostatIpAddress}/sys/name`, { name: newName });
