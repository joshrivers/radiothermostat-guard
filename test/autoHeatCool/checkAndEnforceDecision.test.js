'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('AutoHeatCool Check and Enforce Decision Module', () => {
  it('should return a execution function', (done) => {
    const checkAndEnforceDecision = proxyquire('../../src/autoHeatCool/checkAndEnforceDecision', {
      './getCurrentAutoStatus': () => {},
      './makeDecisionFromStatus': () => {},
      './enforceDecision': () => {},
      './logStatusAndDecision': () => {}
    });
    expect(checkAndEnforceDecision).to.be.an.instanceof(Function);
    done();
  });
  it('should get current auto status, make a decision from it, and enforce that decision', async () => {
    const getCurrentAutoStatusMock = sinon.stub().resolves('current status');
    const makeDecisionFromStatusMock = sinon.stub().returns('derived decision');
    const enforceDecisionMock = sinon.stub().resolves();
    const checkAndEnforceDecision = proxyquire('../../src/autoHeatCool/checkAndEnforceDecision', {
      './getCurrentAutoStatus': getCurrentAutoStatusMock,
      './makeDecisionFromStatus': makeDecisionFromStatusMock,
      './enforceDecision': enforceDecisionMock,
      './logStatusAndDecision': () => {}
    });
    await checkAndEnforceDecision();
    sinon.assert.calledOnce(getCurrentAutoStatusMock);
    sinon.assert.calledWithExactly(getCurrentAutoStatusMock);
    sinon.assert.calledOnce(makeDecisionFromStatusMock);
    sinon.assert.calledWithExactly(makeDecisionFromStatusMock, 'current status');
    sinon.assert.calledOnce(enforceDecisionMock);
    sinon.assert.calledWithExactly(enforceDecisionMock, 'derived decision');
  });
  it('should handle enforcement rejections', async () => {
    const getCurrentAutoStatusMock = sinon.stub().resolves('current status');
    const makeDecisionFromStatusMock = sinon.stub().returns('derived decision');
    const anticipatedError = new Error('Expected Error');
    const enforceDecisionMock = sinon.stub().rejects(anticipatedError);
    const checkAndEnforceDecision = proxyquire('../../src/autoHeatCool/checkAndEnforceDecision', {
      './getCurrentAutoStatus': getCurrentAutoStatusMock,
      './makeDecisionFromStatus': makeDecisionFromStatusMock,
      './enforceDecision': enforceDecisionMock,
      './logStatusAndDecision': () => {}
    });
    try {
      await checkAndEnforceDecision();
    } catch (err) {
      sinon.assert.calledOnce(getCurrentAutoStatusMock);
      sinon.assert.calledWithExactly(getCurrentAutoStatusMock);
      sinon.assert.calledOnce(makeDecisionFromStatusMock);
      sinon.assert.calledWithExactly(makeDecisionFromStatusMock, 'current status');
      sinon.assert.calledOnce(enforceDecisionMock);
      sinon.assert.calledWithExactly(enforceDecisionMock, 'derived decision');
      expect(err).to.equal(anticipatedError);
      return;
    }
    expect('execution').to.equal('complete in line above');
  });
  it('should log status and decision', async () => {
    const getCurrentAutoStatusMock = sinon.stub().resolves('current status');
    const makeDecisionFromStatusMock = sinon.stub().returns('derived decision');
    const enforceDecisionMock = sinon.stub().resolves();
    const logStatusAndDecisionMock = sinon.stub();
    const checkAndEnforceDecision = proxyquire('../../src/autoHeatCool/checkAndEnforceDecision', {
      './getCurrentAutoStatus': getCurrentAutoStatusMock,
      './makeDecisionFromStatus': makeDecisionFromStatusMock,
      './enforceDecision': enforceDecisionMock,
      './logStatusAndDecision': logStatusAndDecisionMock
    });
    await checkAndEnforceDecision();
    sinon.assert.calledOnce(logStatusAndDecisionMock);
    sinon.assert.calledWithExactly(logStatusAndDecisionMock,
      'current status',
      'derived decision');
  });
});
