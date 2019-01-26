'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('AutoHeatCool Enforce Decision Module', () => {
  it('should return a async function', (done) => {
    const clientMock = {
      getCurrentState: sinon.stub(),
      setHeatingModeTargetAndHold: sinon.stub(),
      setCoolingModeTargetAndHold: sinon.stub()
    };
    const decisionCacheMock = {
      storeEnforcedDecision: sinon.stub()
    };
    const enforceDecision = proxyquire('../../src/autoHeatCool/enforceDecision', {
      './configuredRadioThermostatClient': clientMock,
      './lastEnforcedDecision': decisionCacheMock
    });
    expect(enforceDecision).to.be.an.instanceof(Function);
    done();
  });
  describe('When Decision has no changes', () => {
    it('should not call radiothermostatClient', async () => {
      const clientMock = {
        getCurrentState: sinon.stub(),
        setHeatingModeTargetAndHold: sinon.stub(),
        setCoolingModeTargetAndHold: sinon.stub()
      };
      const decisionCacheMock = {
        storeEnforcedDecision: sinon.stub()
      };
      const enforceDecision = proxyquire('../../src/autoHeatCool/enforceDecision', {
        './configuredRadioThermostatClient': clientMock,
        './lastEnforcedDecision': decisionCacheMock
      });
      const decision = {
        shouldEnforceChange: false,
        targetTemperature: 54,
        hvacMode: 'Heat'
      };
      await enforceDecision(decision);
      sinon.assert.notCalled(clientMock.getCurrentState);
      sinon.assert.notCalled(clientMock.setHeatingModeTargetAndHold);
      sinon.assert.notCalled(clientMock.setCoolingModeTargetAndHold);
      sinon.assert.notCalled(decisionCacheMock.storeEnforcedDecision);
    });
  });
  describe('When Decision has changes', () => {
    it('hvacMode must be valid', async () => {
      const clientMock = {
        getCurrentState: sinon.stub(),
        setHeatingModeTargetAndHold: sinon.stub(),
        setCoolingModeTargetAndHold: sinon.stub()
      };
      const decisionCacheMock = {
        storeEnforcedDecision: sinon.stub()
      };
      const enforceDecision = proxyquire('../../src/autoHeatCool/enforceDecision', {
        './configuredRadioThermostatClient': clientMock,
        './lastEnforcedDecision': decisionCacheMock
      });
      const decision = {
        shouldEnforceChange: true,
        targetTemperature: 54,
        hvacMode: 'NotSoHot'
      };
      try {
        await enforceDecision(decision);
      } catch (expectedError) {
        expect(expectedError.message).to.equal('Decision must have a valid HVAC Mode.');
        sinon.assert.notCalled(clientMock.getCurrentState);
        sinon.assert.notCalled(clientMock.setHeatingModeTargetAndHold);
        sinon.assert.notCalled(clientMock.setCoolingModeTargetAndHold);
        sinon.assert.notCalled(decisionCacheMock.storeEnforcedDecision);
        return;
      }
      expect(false, 'Expected an error here.').to.be.ok();
    });
    it('should call radiothermostatClient setHeatingModeTargetAndHold for heat and store decision', async () => {
      const clientMock = {
        getCurrentState: sinon.stub(),
        setHeatingModeTargetAndHold: sinon.stub(),
        setCoolingModeTargetAndHold: sinon.stub()
      };
      const decisionCacheMock = {
        storeEnforcedDecision: sinon.stub()
      };
      const enforceDecision = proxyquire('../../src/autoHeatCool/enforceDecision', {
        './configuredRadioThermostatClient': clientMock,
        './lastEnforcedDecision': decisionCacheMock
      });
      const decision = {
        shouldEnforceChange: true,
        targetTemperature: 54,
        hvacMode: 'Heat'
      };
      await enforceDecision(decision);
      sinon.assert.notCalled(clientMock.getCurrentState);
      sinon.assert.calledOnce(clientMock.setHeatingModeTargetAndHold);
      sinon.assert.calledWithExactly(clientMock.setHeatingModeTargetAndHold, 54);
      sinon.assert.notCalled(clientMock.setCoolingModeTargetAndHold);
      sinon.assert.calledOnce(decisionCacheMock.storeEnforcedDecision);
      sinon.assert.calledWithExactly(decisionCacheMock.storeEnforcedDecision, decision);
    });
    it('should call radiothermostatClient setCoolingModeTargetAndHold for cool and store decision', async () => {
      const clientMock = {
        getCurrentState: sinon.stub(),
        setHeatingModeTargetAndHold: sinon.stub(),
        setCoolingModeTargetAndHold: sinon.stub()
      };
      const decisionCacheMock = {
        storeEnforcedDecision: sinon.stub()
      };
      const enforceDecision = proxyquire('../../src/autoHeatCool/enforceDecision', {
        './configuredRadioThermostatClient': clientMock,
        './lastEnforcedDecision': decisionCacheMock
      });
      const decision = {
        shouldEnforceChange: true,
        targetTemperature: 80,
        hvacMode: 'Cool'
      };
      await enforceDecision(decision);
      sinon.assert.notCalled(clientMock.getCurrentState);
      sinon.assert.calledOnce(clientMock.setCoolingModeTargetAndHold);
      sinon.assert.calledWithExactly(clientMock.setCoolingModeTargetAndHold, 80);
      sinon.assert.notCalled(clientMock.setHeatingModeTargetAndHold);
      sinon.assert.calledOnce(decisionCacheMock.storeEnforcedDecision);
      sinon.assert.calledWithExactly(decisionCacheMock.storeEnforcedDecision, decision);
    });
  });
});
