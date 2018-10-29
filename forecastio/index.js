"use strict";

const rp = require("request-promise"),
  lat = "45.5663063",
  long = "-122.837492",
  key = process.env.DARKSKY_API_KEY,
  url = `https://api.darksky.net/forecast/${key}/${lat},${long}`;

module.exports.forecast = function() {
  return rp.get(url);
};
