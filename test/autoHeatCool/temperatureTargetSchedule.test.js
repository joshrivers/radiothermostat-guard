'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const moment = require('moment');

describe('AutoHeatCool Temperature Target Schedule Module', () => {
  it('should return a lookup function', (done) => {
    const temperatureTargetSchedule = proxyquire('../../src/autoHeatCool/temperatureTargetSchedule', {
      moment: sinon.stub()
    });
    expect(temperatureTargetSchedule).to.be.an.instanceof(Function);
    done();
  });
  it('should return Heat 69 Cool 72 for midnight today', (done) => {
    const midnight = moment().startOf('day');
    const temperatureTargetSchedule = proxyquire('../../src/autoHeatCool/temperatureTargetSchedule', {
    });
    const returnedSchedule = temperatureTargetSchedule(midnight);
    expect(returnedSchedule.Heat).to.equal(69);
    expect(returnedSchedule.Cool).to.equal(72);
    done();
  });
});
