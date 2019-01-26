'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const moment = require('moment');

describe('AutoHeatCool Manual Override Timer Module', () => {
  it('should return a set of functions to interact with the timer', (done) => {
    const manualOverrideTimer = proxyquire('../../src/autoHeatCool/manualOverrideTimer', {
    });
    expect(manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ).to.be.an.instanceof(Function);
    expect(manualOverrideTimer.getCurrentOverrideTimer).to.be.an.instanceof(Function);
    expect(manualOverrideTimer.clearOverrideTimer).to.be.an.instanceof(Function);
    done();
  });
  it('should return null from getCurrentOverrideTimer if there is no timer', (done) => {
    const momentInstance = { clone: sinon.stub().returns('now moment') };
    momentInstance.add = sinon.stub().returns(momentInstance);
    const momentMock = sinon.stub().returns(momentInstance);
    const manualOverrideTimer = proxyquire('../../src/autoHeatCool/manualOverrideTimer', {
      moment: momentMock
    });
    expect(manualOverrideTimer.getCurrentOverrideTimer()).to.be.undefined;
    manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ();
    expect(manualOverrideTimer.getCurrentOverrideTimer()).to.be.ok;
    manualOverrideTimer.clearOverrideTimer();
    expect(manualOverrideTimer.getCurrentOverrideTimer()).to.be.undefined;
    done();
  });
  it('should set the stored timer and allow retrieval of clones', (done) => {
    const momentInstance = { clone: sinon.stub().returns('now moment') };
    momentInstance.add = sinon.stub().returns(momentInstance);
    const momentMock = sinon.stub().returns(momentInstance);
    const manualOverrideTimer = proxyquire('../../src/autoHeatCool/manualOverrideTimer', {
      moment: momentMock
    });
    const firstCallExpiryResult = manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ();
    expect(firstCallExpiryResult).to.be.false;
    const storedMoment = manualOverrideTimer.getCurrentOverrideTimer();
    expect(storedMoment).to.equal('now moment');
    sinon.assert.calledOnce(momentMock);
    sinon.assert.calledWithExactly(momentMock);
    sinon.assert.calledOnce(momentInstance.clone);
    sinon.assert.calledWithExactly(momentInstance.clone);
    sinon.assert.calledOnce(momentInstance.add);
    sinon.assert.calledWithExactly(momentInstance.add, 4, 'hours');
    done();
  });
  it('should return false from isTimerExpired? when the timer not yet expired', (done) => {
    const momentFirstInstance = moment('2013-02-08 05:29');
    const momentSecondInstance = moment('2013-02-08 09:28');
    const momentMock = sinon.stub()
      .onFirstCall().returns(momentFirstInstance)
      .onSecondCall()
      .returns(momentSecondInstance);
    const manualOverrideTimer = proxyquire('../../src/autoHeatCool/manualOverrideTimer', {
      moment: momentMock
    });
    const firstCallExpiryResult = manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ();
    expect(firstCallExpiryResult).to.be.false;
    const storedMoment = manualOverrideTimer.getCurrentOverrideTimer();
    expect(storedMoment.format()).to.equal('2013-02-08T09:29:00-08:00');
    const secondCallExpiryResult = manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ();
    expect(secondCallExpiryResult).to.be.false;
    done();
  });
  it('should return true from isTimerExpired? when the timer expires', (done) => {
    const momentFirstInstance = moment('2013-02-08 05:29');
    const momentSecondInstance = moment('2013-02-08 09:30');
    const momentMock = sinon.stub()
      .onFirstCall().returns(momentFirstInstance)
      .onSecondCall()
      .returns(momentSecondInstance);
    const manualOverrideTimer = proxyquire('../../src/autoHeatCool/manualOverrideTimer', {
      moment: momentMock
    });
    const firstCallExpiryResult = manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ();
    expect(firstCallExpiryResult).to.be.false;
    const storedMoment = manualOverrideTimer.getCurrentOverrideTimer();
    expect(storedMoment.format()).to.equal('2013-02-08T09:29:00-08:00');
    const secondCallExpiryResult = manualOverrideTimer.scheduleIsOverriddenIsTimerExpiredʔ();
    expect(secondCallExpiryResult).to.be.true;
    done();
  });
});
