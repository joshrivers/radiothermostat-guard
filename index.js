'use strict';

const express = require('express');
const forecastio = require('./forecastio');
const { discover } = require('./radiothermostat');
const radiothermostat = require('./radiothermostat');
const logger = require('./src/logger');

const app = express();
let address = '0.0.0.0';

discover().then((addresses) => {
  [address] = addresses;
  logger.info(`Serving for RadioThermostat at ${address}`);
  app.get('/', (req, res) => {
    res.send('Radio Thermostat Interface');
  });

  app.get('/tstat/datalog', (req, res) => {
    radiothermostat.get.tstat_datalog(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/sys/name', (req, res) => {
    radiothermostat.get.sys_name(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/tstat/model', (req, res) => {
    radiothermostat.get.tstat_model(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/sys', (req, res) => {
    radiothermostat.get.sys(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/tstat', (req, res) => {
    radiothermostat.get.tstat(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/tstat/ttemp', (req, res) => {
    radiothermostat.get.tstat_ttemp(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/tstat/power', (req, res) => {
    radiothermostat.get.tstat_power(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/tstat/program/cool', (req, res) => {
    radiothermostat.get.tstat_program_cool(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/tstat/program/heat', (req, res) => {
    radiothermostat.get.tstat_program_heat(address).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/setHeat68', (req, res) => {
    radiothermostat.post.setTargetHeat(address, 68).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/setCool68', (req, res) => {
    radiothermostat.post.setTargetCooling(address, 68).then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.get('/forecast', (req, res) => {
    forecastio.forecast().then((result) => {
      logger.info(result);
      res.send(result);
    });
  });

  app.listen(3000, () => {
    logger.info('Radio Thermostat Interface listening on port 3000!');
  });
});
