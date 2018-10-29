const express = require('express');
const forecastio = require('./forecastio');
const discover = require('./radiothermostat').discover;
const radiothermostat = require('./radiothermostat');
const app = express();
let address = '0.0.0.0';

discover().then(addresses => {
  address = addresses[0];
  console.log('Serving for RadioThermostat at ' + address);
  app.get('/', function(req, res) {
    res.send('Radio Thermostat Interface');
  });

  app.get('/tstat/datalog', function(req, res) {
    radiothermostat.get.tstat_datalog(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/sys/name', function(req, res) {
    radiothermostat.get.sys_name(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/tstat/model', function(req, res) {
    radiothermostat.get.tstat_model(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/sys', function(req, res) {
    radiothermostat.get.sys(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/tstat', function(req, res) {
    radiothermostat.get.tstat(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/tstat/ttemp', function(req, res) {
    radiothermostat.get.tstat_ttemp(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/tstat/power', function(req, res) {
    radiothermostat.get.tstat_power(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/tstat/program/cool', function(req, res) {
    radiothermostat.get.tstat_program_cool(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/tstat/program/heat', function(req, res) {
    radiothermostat.get.tstat_program_heat(address).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/setHeat68', function(req, res) {
    radiothermostat.post.setTargetHeat(address, 68).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/setCool68', function(req, res) {
    radiothermostat.post.setTargetCooling(address, 68).then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.get('/forecast', function(req, res) {
    forecastio.forecast().then(result => {
      console.log(result);
      res.send(result);
    });
  });

  app.listen(3000, function() {
    console.log('Radio Thermostat Interface listening on port 3000!');
  });
});
