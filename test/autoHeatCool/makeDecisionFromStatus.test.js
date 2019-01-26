'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('AutoHeatCool Make Decision From Status Module', () => {
  const createStatus = (overrides) => {
    const defaults = {
      roomTemp: 70,
      hvacMode: 'Cool',
      tempSetting: 72,
      hold: true,
      schedule: { Heat: 69, Cool: 72 },
      override: {
        temperatureTargetIsOverridden: true,
        overrideTimerIsExpired: false,
        timerExpiryMoment: 'moment object'
      }
    };
    const options = Object.assign(defaults, overrides);
    const status = {};
    status.currentMoment = 'current moment';
    status.roomTemperature = options.roomTemp;
    status.hvacMode = options.hvacMode;
    status.currentTemperatureSetting = options.tempSetting;
    status.holdEnabled = options.hold;
    status.currentTargetTemperature = options.schedule;
    status.override = options.override;
    return status;
  };
  it('should return a transform function', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    expect(makeDecisionFromStatus).to.be.an.instanceof(Function);
    done();
  });
  it('should return no change when temperature is in range and override is off', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus());
    expect(decision.shouldEnforceChange).to.equal(false);
    expect(decision.targetTemperature).to.equal(72);
    expect(decision.hvacMode).to.equal('Cool');
    done();
  });
  it('should return no change when temperature is in range and override is off', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus({ hvacMode: 'Heat', tempSetting: 69 }));
    expect(decision.shouldEnforceChange).to.equal(false);
    expect(decision.targetTemperature).to.equal(69);
    expect(decision.hvacMode).to.equal('Heat');
    done();
  });
  it('should return no change when temperature is above schedule limit and setting is correct', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus({ roomTemp: 74, hvacMode: 'Cool', tempSetting: 72 }));
    expect(decision.shouldEnforceChange).to.equal(false);
    expect(decision.targetTemperature).to.equal(72);
    expect(decision.hvacMode).to.equal('Cool');
    done();
  });
  it('should return enforced change when temperature is above schedule limit and setting is wrong', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus({ roomTemp: 74, hvacMode: 'Heat', tempSetting: 69 }));
    expect(decision.shouldEnforceChange).to.equal(true);
    expect(decision.targetTemperature).to.equal(72);
    expect(decision.hvacMode).to.equal('Cool');
    done();
  });
  it('should return no change when temperature is below schedule limit and setting is correct', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus({ roomTemp: 65, hvacMode: 'Heat', tempSetting: 69 }));
    expect(decision.shouldEnforceChange).to.equal(false);
    expect(decision.targetTemperature).to.equal(69);
    expect(decision.hvacMode).to.equal('Heat');
    done();
  });
  it('should return enforced change when temperature is below schedule limit and setting is wrong', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus({ roomTemp: 65, hvacMode: 'Cool', tempSetting: 72 }));
    expect(decision.shouldEnforceChange).to.equal(true);
    expect(decision.targetTemperature).to.equal(69);
    expect(decision.hvacMode).to.equal('Heat');
    done();
  });
  it('should return enforced change when override is true and expired', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus({
      hvacMode: 'Cool',
      tempSetting: 70,
      override: {
        temperatureTargetIsOverridden: true,
        overrideTimerIsExpired: true,
        timerExpiryMoment: 'moment object'
      }
    }));
    expect(decision.shouldEnforceChange).to.equal(true);
    expect(decision.targetTemperature).to.equal(72);
    expect(decision.hvacMode).to.equal('Cool');
    done();
  });
  it('should return enforced change when override is true and expired', (done) => {
    const makeDecisionFromStatus = proxyquire('../../src/autoHeatCool/makeDecisionFromStatus', {
      moment: sinon.stub()
    });
    const decision = makeDecisionFromStatus(createStatus({
      hvacMode: 'Heat',
      tempSetting: 70,
      override: {
        temperatureTargetIsOverridden: true,
        overrideTimerIsExpired: true,
        timerExpiryMoment: 'moment object'
      }
    }));
    expect(decision.shouldEnforceChange).to.equal(true);
    expect(decision.targetTemperature).to.equal(69);
    expect(decision.hvacMode).to.equal('Heat');
    done();
  });
});
