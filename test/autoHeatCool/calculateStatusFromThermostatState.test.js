'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

// thermostat state example:
// {"temp":70.00,"tmode":1,"fmode":0,"override":0,"hold":1,
//  "t_heat":69.00,"tstate":0,"fstate":0,"time":{"day":4,
//  "hour":17,"minute":49},"t_type_post":0}

describe('AutoHeatCool Calculate Status from Thermostat State Module', () => {
  it('should return a translation function', (done) => {
    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
      moment: sinon.stub()
    });
    expect(calculateStatusFromThermostatState).to.be.an.instanceof(Function);
    done();
  });
  it('should add the current time from moment.js as currentMoment', (done) => {
    const momentMock = sinon.stub().returns('current moment');
    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
      moment: momentMock
    });
    const state = {};
    const returnedStatus = calculateStatusFromThermostatState(state);
    expect(returnedStatus.currentMoment).to.equal('current moment');
    done();
  });
  it('should add the room temperature reported by the thermostat', (done) => {
    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
    });
    const state = { temp: 59.98 };
    const returnedStatus = calculateStatusFromThermostatState(state);
    expect(returnedStatus.roomTemperature).to.equal(59.98);
    expect(calculateStatusFromThermostatState({ temp: 70.00 }).roomTemperature).to.equal(70);
    done();
  });
  it('should add current hvac mode reported by thermostat as Heat/Cool/Off/Auto', (done) => {
    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
    });
    expect(calculateStatusFromThermostatState({ tmode: 0 }).hvacMode).to.equal('Off');
    expect(calculateStatusFromThermostatState({ tmode: 1 }).hvacMode).to.equal('Heat');
    expect(calculateStatusFromThermostatState({ tmode: 2 }).hvacMode).to.equal('Cool');
    expect(calculateStatusFromThermostatState({ tmode: 3 }).hvacMode).to.equal('Auto');
    expect(calculateStatusFromThermostatState({ tmode: 'pie' }).hvacMode).to.equal('Invalid');
    done();
  });
  it('should add current temperature reported by thermostat depending on tmode', (done) => {
    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
    });
    expect(calculateStatusFromThermostatState({ tmode: 0, t_heat: 68, t_cool: 72 })
      .currentTemperatureSetting).to.equal(0);
    expect(calculateStatusFromThermostatState({ tmode: 1, t_heat: 68, t_cool: 72 })
      .currentTemperatureSetting).to.equal(68);
    expect(calculateStatusFromThermostatState({ tmode: 2, t_heat: 68, t_cool: 72 })
      .currentTemperatureSetting).to.equal(72);
    expect(calculateStatusFromThermostatState({ tmode: 3, t_heat: 68, t_cool: 72 })
      .currentTemperatureSetting).to.equal(0);
    expect(calculateStatusFromThermostatState({ tmode: 'pie', t_heat: 68, t_cool: 72 })
      .currentTemperatureSetting).to.equal(0);
    done();
  });
  it('should add hold status reported by thermostat', (done) => {
    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
    });
    expect(calculateStatusFromThermostatState({ hold: 0 }).holdEnabled).to.equal(false);
    expect(calculateStatusFromThermostatState({ hold: 1 }).holdEnabled).to.equal(true);
    done();
  });
  it('should add current target temperatures based on time from temperatureTargetSchedule module', (done) => {
    const momentMock = sinon.stub().returns('current moment');
    const targetScheduleMock = sinon.stub().returns({
      Heat: 69,
      Cool: 71
    });

    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
      moment: momentMock,
      './temperatureTargetSchedule': targetScheduleMock
    });
    const returnedStatus = calculateStatusFromThermostatState({ });
    sinon.assert.calledOnce(targetScheduleMock);
    sinon.assert.calledWithExactly(targetScheduleMock, 'current moment');
    expect(returnedStatus.currentTargetTemperature.Cool).to.equal(71);
    expect(returnedStatus.currentTargetTemperature.Heat).to.equal(69);
    done();
  });
  it('should add override status from manualOverrideDetector', (done) => {
    const overrideState = {
      temperatureTargetIsOverridden: true,
      overrideTimerIsExpired: false,
      timerExpiryMoment: 'moment object'
    };
    const manualOverrideDetectorMock = sinon.stub().returns(overrideState);
    const calculateStatusFromThermostatState = proxyquire('../../src/autoHeatCool/calculateStatusFromThermostatState', {
      './manualOverrideDetector': manualOverrideDetectorMock
    });
    const returnedStatus = calculateStatusFromThermostatState({ tmode: 1, t_heat: 68 });
    sinon.assert.calledOnce(manualOverrideDetectorMock);
    sinon.assert.calledWithExactly(manualOverrideDetectorMock, 'Heat', 68);
    expect(returnedStatus.override).to.equal(overrideState);
    done();
  });
});
