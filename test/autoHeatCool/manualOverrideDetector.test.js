'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('AutoHeatCool Manual Override Detector Module', () => {
  it('should return a detector function', (done) => {
    const manualOverrideDetector = proxyquire('../../src/autoHeatCool/manualOverrideDetector', {
    });
    expect(manualOverrideDetector).to.be.an.instanceof(Function);
    done();
  });
  it('should calculate override status calculated from previous decisions', (done) => {
    const decision = {
      shouldEnforceChange: true,
      targetTemperature: 54,
      hvacMode: 'Heat'
    };
    const lastEnforcedDecisionMock = sinon.stub().returns(decision);
    const manualOverrideDetector = proxyquire('../../src/autoHeatCool/manualOverrideDetector', {
      './lastEnforcedDecision': { getLastEnforcedDecision: lastEnforcedDecisionMock },
      './manualOverrideTimer': {
        scheduleIsOverriddenIsTimerExpiredʔ: sinon.stub(),
        getCurrentOverrideTimer: sinon.stub(),
        clearOverrideTimer: sinon.stub()
      },
    });
    expect(manualOverrideDetector('Heat', 54)
      .temperatureTargetIsOverridden).to.equal(false);
    expect(manualOverrideDetector('Cool', 54)
      .temperatureTargetIsOverridden).to.equal(true);
    expect(manualOverrideDetector('Heat', 68)
      .temperatureTargetIsOverridden).to.equal(true);
    done();
  });
  it('should clear override timer when target matches current setting', (done) => {
    const decision = {
      shouldEnforceChange: true,
      targetTemperature: 54,
      hvacMode: 'Heat'
    };
    const lastEnforcedDecisionMock = sinon.stub().returns(decision);
    const clearOverrideTimerStub = sinon.stub();
    const manualOverrideDetector = proxyquire('../../src/autoHeatCool/manualOverrideDetector', {
      './lastEnforcedDecision': { getLastEnforcedDecision: lastEnforcedDecisionMock },
      './manualOverrideTimer': { clearOverrideTimer: clearOverrideTimerStub },
    });
    const detectorResult = manualOverrideDetector('Heat', 54);
    expect(detectorResult.temperatureTargetIsOverridden).to.equal(false);
    expect(detectorResult.overrideTimerIsExpired).to.equal(false);
    sinon.assert.calledOnce(clearOverrideTimerStub);
    sinon.assert.calledWithExactly(clearOverrideTimerStub);
    done();
  });
  it('should clear override timer when last setting missing', (done) => {
    const lastEnforcedDecisionMock = sinon.stub().returns(null);
    const clearOverrideTimerStub = sinon.stub();
    const manualOverrideDetector = proxyquire('../../src/autoHeatCool/manualOverrideDetector', {
      './lastEnforcedDecision': { getLastEnforcedDecision: lastEnforcedDecisionMock },
      './manualOverrideTimer': { clearOverrideTimer: clearOverrideTimerStub },
    });
    const detectorResult = manualOverrideDetector('Heat', 54);
    expect(detectorResult.temperatureTargetIsOverridden).to.equal(true);
    expect(detectorResult.overrideTimerIsExpired).to.equal(true);
    sinon.assert.calledOnce(clearOverrideTimerStub);
    sinon.assert.calledWithExactly(clearOverrideTimerStub);
    done();
  });
  it('should query override timer when target setting does not match', (done) => {
    const decision = {
      shouldEnforceChange: true,
      targetTemperature: 83,
      hvacMode: 'Cool'
    };
    const lastEnforcedDecisionMock = sinon.stub().returns(decision);
    const isTimerExpiredStub = sinon.stub().returns(false);
    const getCurrentOverrideTimer = sinon.stub().returns('a moment');
    const manualOverrideDetector = proxyquire('../../src/autoHeatCool/manualOverrideDetector', {
      './lastEnforcedDecision': { getLastEnforcedDecision: lastEnforcedDecisionMock },
      './manualOverrideTimer': {
        scheduleIsOverriddenIsTimerExpiredʔ: isTimerExpiredStub,
        getCurrentOverrideTimer
      },
    });
    const detectorResult = manualOverrideDetector('Heat', 54);
    expect(detectorResult.temperatureTargetIsOverridden).to.equal(true);
    expect(detectorResult.overrideTimerIsExpired).to.equal(false);
    expect(detectorResult.timerExpiryMoment).to.equal('a moment');
    sinon.assert.calledOnce(isTimerExpiredStub);
    sinon.assert.calledWithExactly(isTimerExpiredStub);
    sinon.assert.calledOnce(getCurrentOverrideTimer);
    sinon.assert.calledWithExactly(getCurrentOverrideTimer);
    done();
  });
  it('should query override timer when target setting does not match', (done) => {
    const decision = {
      shouldEnforceChange: true,
      targetTemperature: 83,
      hvacMode: 'Cool'
    };
    const lastEnforcedDecisionMock = sinon.stub().returns(decision);
    const isTimerExpiredStub = sinon.stub().returns(true);
    const getCurrentOverrideTimer = sinon.stub().returns('a moment');
    const manualOverrideDetector = proxyquire('../../src/autoHeatCool/manualOverrideDetector', {
      './lastEnforcedDecision': { getLastEnforcedDecision: lastEnforcedDecisionMock },
      './manualOverrideTimer': {
        scheduleIsOverriddenIsTimerExpiredʔ: isTimerExpiredStub,
        getCurrentOverrideTimer
      },
    });
    const detectorResult = manualOverrideDetector('Heat', 54);
    expect(detectorResult.temperatureTargetIsOverridden).to.equal(true);
    expect(detectorResult.overrideTimerIsExpired).to.equal(true);
    expect(detectorResult.timerExpiryMoment).to.equal('a moment');
    sinon.assert.calledOnce(isTimerExpiredStub);
    sinon.assert.calledWithExactly(isTimerExpiredStub);
    sinon.assert.calledOnce(getCurrentOverrideTimer);
    sinon.assert.calledWithExactly(getCurrentOverrideTimer);
    done();
  });
});
