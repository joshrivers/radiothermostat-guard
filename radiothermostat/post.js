'use strict';

const rp = require('request-promise');
const createPostOptions = function(url, body) {
    return {
        method: 'POST',
        uri: url,
        body: body,
        json: true
    };
};
const requestPost = function(url, body) {
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

module.exports.activateHold = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { hold: 1 });
};

module.exports.removeHold = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { hold: 0 });
};

module.exports.setTargetHeat = function(thermostatIpAddress, newHeatingTemperature) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 1, t_heat: newHeatingTemperature });
};

module.exports.setTargetCooling = function(thermostatIpAddress, newCoolingTemperature) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 2, t_cool: newCoolingTemperature });
};

module.exports.setAutoHeatCool = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 3 });
};

module.exports.setHeatCoolOff = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 0 });
};

module.exports.setAirConditioningOn = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 2 });
};

module.exports.setFurnaceOn = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 1 });
};

module.exports.setFanAuto = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { fmode: 0 });
};

module.exports.setFanOn = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { fmode: 2 });
};

module.exports.setFanCirculate = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/tstat`, { tmode: 1 });
};

module.exports.reboot = function(thermostatIpAddress) {
    return requestPost(`http://${thermostatIpAddress}/sys/command`, { command: 'reboot' });
};

module.exports.sys_mode = function(thermostatIpAddress, preferredMode) {
    if (preferredMode == 'Normal') {
        return requestPost(`http://${thermostatIpAddress}/sys/mode`, { mode: 1 });
    }
    if (preferredMode == 'Provisioning') {
        return requestPost(`http://${thermostatIpAddress}/sys/mode`, { mode: 0 });
    }
    return Promise.reject('Specified mode not recognized');
};

module.exports.sys_name = function(thermostatIpAddress, newName) {
    return requestPost(`http://${thermostatIpAddress}/sys/name`, { name: newName });
};
