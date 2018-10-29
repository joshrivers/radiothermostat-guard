// const express = require("express");
// const findThermostat = require("./thermostat");
const forecastio = require('./forecastio');
// const discover = require("./radiothermostat").discover;
const radiothermostat = require('./radiothermostat');
// const app = express();
let address = process.env.THERMOSTAT_IP;

// discover().then(addresses => {
// address = addresses[0];
console.log(address);
// radiothermostat.get.tstat_datalog(address).then(result => {
//   console.log(result);
// });

// radiothermostat.get.sys_name(address).then(result => {
//   console.log(result);
// });

// app.get('/tstat/model', function(req, res) {
//   radiothermostat.get.tstat_model(address).then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

radiothermostat.get.sys(address).then(result => {
  console.log(result);
});

radiothermostat.post.reboot(address).then(result => {
  console.log(result);
});

// radiothermostat.get.tstat(address).then(result => {
//   console.log(result);
//   result = JSON.parse(result);
//   if (result.tmode == 1) {
//     console.log("Heat");
//   }
//   if (result.tmode == 2) {
//     console.log("Cool");
//   }
//   console.log(`Indoor Temperature is ${result.temp}`);
//   radiothermostat.post.setFurnaceOn(address);
// });

// app.get('/tstat/ttemp', function(req, res) {
//   radiothermostat.get.tstat_ttemp(address).then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

// app.get('/tstat/power', function(req, res) {
//   radiothermostat.get.tstat_power(address).then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

// app.get('/tstat/program/cool', function(req, res) {
//   radiothermostat.get.tstat_program_cool(address).then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

// app.get('/tstat/program/heat', function(req, res) {
//   radiothermostat.get.tstat_program_heat(address).then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

// app.get('/setHeat68', function(req, res) {
//   radiothermostat.post.setTargetHeat(address, 68).then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

// app.get('/setCool68', function(req, res) {
//   radiothermostat.post.setTargetCooling(address, 68).then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

// app.get('/forecast', function(req, res) {
//   forecastio.forecast().then(result => {
//     console.log(result);
//     res.send(result);
//   });
// });

// app.listen(3000, function() {
//   console.log('Radio Thermostat Interface listening on port 3000!')
// });
// });
