"use strict";

const radiothermostat = require("./radiothermostat");
const Promise = require("bluebird");
const assert = require("assert");
let address = process.env.THERMOSTAT_IP;
let delay = parseInt(process.env.POLLING_DELAY);

if (address === "unset") {
  console.error("THERMOSTAT_IP address environment variable not set.");
  process.exit(1);
} else {
  console.log(`Connecting to RadioThermostat at ${address}.`);
}

process.on("unhandledRejection", error => {
  // Will print "unhandledRejection err is not defined"
  console.error("unhandledRejection", error);
});

const queryThermostat = async function() {
  const currentThermostatStateString = await radiothermostat.get.tstat(address);
  const currentThermostatState = JSON.parse(currentThermostatStateString);
  const extractedResult = {
    temperature: 0,
    hold: "invalid",
    heatAcMode: "invalid"
  };
  extractedResult.temperature = currentThermostatState.temp;
  if (currentThermostatState.hold === 0) {
    extractedResult.hold = "Off";
  }
  if (currentThermostatState.hold === 1) {
    extractedResult.hold = "On";
  }
  assert.notEqual(extractedResult.hold, "invalid");
  if (currentThermostatState.tmode === 0) {
    extractedResult.heatAcMode = "Off";
  }
  if (currentThermostatState.tmode === 1) {
    extractedResult.heatAcMode = "Heat";
  }
  if (currentThermostatState.tmode === 2) {
    extractedResult.heatAcMode = "Cool";
  }
  if (currentThermostatState.tmode === 3) {
    extractedResult.heatAcMode = "Auto";
  }
  console.log(
    `Current Temperature is ${extractedResult.temperature}, mode is ${extractedResult.heatAcMode}, hold is ${extractedResult.hold}. Time is ${currentThermostatState
      .time.hour}:${currentThermostatState.time.minute} ${currentThermostatStateString}`
  );
  return extractedResult;
};

const enforceState = async function(thermostatState) {
  if (thermostatState.temperature >= 72 && thermostatState.heatAcMode === "Heat") {
    console.log("Cooling down the house.");
    await radiothermostat.post.setTargetCooling(address, 72);
    await radiothermostat.post.activateHold(address);
  }
  if (thermostatState.temperature <= 68 && thermostatState.heatAcMode === "Cool") {
    console.log("Heating up the house.");
    await radiothermostat.post.setTargetHeat(address, 68);
    await radiothermostat.post.activateHold(address);
  }
};

const mainLoop = async function() {
  while (true) {
    const thermostatState = await queryThermostat();
    enforceState(thermostatState);
    await Promise.delay(delay);
  }
};

mainLoop();
