'use strict'

const rp = require('request-promise');

module.exports.cloud = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/cloud`);
};

module.exports.sys = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/sys`);
};

module.exports.sys_mode = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/sys/mode`);
};

module.exports.sys_name = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/sys/name`);
};

module.exports.sys_network = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/sys/network`);
};

module.exports.sys_services = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/sys/services`);
};

module.exports.tstat = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat`);
};

module.exports.tstat_model = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/model`);
};

module.exports.tstat_datalog = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/datalog`);
};

module.exports.tstat_hvac_settings = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/hvac_settings`);
};

module.exports.tstat_ttemp = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/ttemp`);
};

module.exports.tstat_tswing = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/tswing`);
};

module.exports.tstat_power = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/power`);
};

module.exports.tstat_program_cool = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/program/cool`);
};

module.exports.tstat_program_heat = function(thermostatIpAddress) {
  return rp.get(`http://${thermostatIpAddress}/tstat/program/heat`);
};