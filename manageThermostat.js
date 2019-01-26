'use strict';

const autoHeatCool = require('./src/autoHeatCool');

const startExecution = async function () {
  await autoHeatCool.mainLoop();
};

startExecution();
