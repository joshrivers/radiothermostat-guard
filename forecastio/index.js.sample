'use strict';

const rp = require('request-promise');

const lat = '45.5663063';

const long = '-122.837492';

const key = process.env.DARKSKY_API_KEY;

const url = `https://api.darksky.net/forecast/${key}/${lat},${long}`;

module.exports.forecast = () => rp.get(url);
