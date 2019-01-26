'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const moment = require('moment');

describe('AutoHeatCool Log Status and Decision Module', () => {
  it('should return a logging function', (done) => {
    const logStatusAndDecision = proxyquire('../../src/autoHeatCool/logStatusAndDecision', {
      '../logger': { info: () => {} }
    });
    expect(logStatusAndDecision).to.be.an.instanceof(Function);
    done();
  });
  it('should call logger with projected data', (done) => {
    const logInfoStub = sinon.stub();
    const status = {
      currentMoment: moment('1986-06-11'),
      roomTemperature: 60,
      currentTemperatureSetting: 80,
      holdEnabled: true,
      hvacMode: 'Heat',
      currentTargetTemperature: 70,
      override: {
        temperatureTargetIsOverridden: false,
        overrideTimerIsExpired: false,
        timerExpiryMoment: moment('1986-05-12')
      }
    };
    const decision = { hvacMode: 'Cool' };
    const logStatusAndDecision = proxyquire('../../src/autoHeatCool/logStatusAndDecision', {
      '../logger': { info: logInfoStub }
    });
    logStatusAndDecision(status, decision);
    sinon.assert.calledOnce(logInfoStub);
    const loggedStructure = logInfoStub.args[0][0];
    expect(loggedStructure.decision).to.equal(decision);
    expect(loggedStructure.status.currentMoment).to.equal('1986-06-11T00:00:00-07:00');
    expect(loggedStructure.status.roomTemperature).to.equal(60);
    expect(loggedStructure.status.hvacMode).to.equal('Heat');
    expect(loggedStructure.status.currentTemperatureSetting).to.equal(80);
    expect(loggedStructure.status.holdEnabled).to.equal(true);
    expect(loggedStructure.status.currentTargetTemperature).to.equal(70);
    expect(loggedStructure.status.override.temperatureTargetIsOverridden).to.equal(false);
    expect(loggedStructure.status.override.overrideTimerIsExpired).to.equal(false);
    expect(loggedStructure.status.override.timerExpiryMoment).to.equal('1986-05-12T00:00:00-07:00');
    // sinon.assert.calledWithExactly(logInfoStub, status, decision);
    done();
  });
});
