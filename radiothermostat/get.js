'use strict';

const rp = require('request-promise');

module.exports.cloud = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/cloud`);

module.exports.sys = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/sys`);

module.exports.sys_mode = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/sys/mode`);

module.exports.sys_name = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/sys/name`);

module.exports.sys_network = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/sys/network`);

module.exports.sys_services = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/sys/services`);

module.exports.tstat = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat`);

module.exports.tstat_model = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/model`);

module.exports.tstat_datalog = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/datalog`);

module.exports.tstat_hvac_settings = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/hvac_settings`);

module.exports.tstat_ttemp = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/ttemp`);

module.exports.tstat_tswing = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/tswing`);

module.exports.tstat_power = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/power`);

module.exports.tstat_program_cool = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/program/cool`);

module.exports.tstat_program_heat = (thermostatIpAddress) => rp.get(`http://${thermostatIpAddress}/tstat/program/heat`);
