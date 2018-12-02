'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Config retrieval module', () => {
  const createLoggerMock = () => ({
    info: sinon.spy(),
    error: sinon.spy()
  });
  beforeEach((done) => {
    delete process.env.THERMOSTAT_IP;
    delete process.env.POLLING_DELAY;
    done();
  });
  afterEach((done) => {
    delete process.env.THERMOSTAT_IP;
    delete process.env.POLLING_DELAY;
    done();
  });
  it('should return thermostatIp from environment', (done) => {
    const exitSpy = sinon.spy();
    const config = proxyquire('../../src/config/index.js', {
      './processWrapper': { exit: exitSpy },
      '../logger': createLoggerMock(),
      './environmentVariables': {
        thermostatIp: 'd.c.b.a',
        pollingDelay: '3600'
      }
    });
    expect(config.thermostatIp).to.be.equal('d.c.b.a');
    sinon.assert.notCalled(exitSpy);
    done();
  });
  it('should exit when thermostatIp is missing from environment', (done) => {
    const exitSpy = sinon.spy();
    proxyquire('../../src/config/index.js', {
      './processWrapper': { exit: exitSpy },
      '../logger': createLoggerMock(),
      './environmentVariables': {
        pollingDelay: '3600'
      }
    });
    sinon.assert.calledOnce(exitSpy);
    sinon.assert.calledWithExactly(exitSpy, 1);
    done();
  });
  it('should exit when thermostatIp is set to "unset" in environment', (done) => {
    const exitSpy = sinon.spy();
    const loggerMock = createLoggerMock();
    proxyquire('../../src/config/index.js', {
      './processWrapper': { exit: exitSpy },
      '../logger': loggerMock,
      './environmentVariables': {
        thermostatIp: 'unset',
        pollingDelay: '3600'
      }
    });
    sinon.assert.calledOnce(exitSpy);
    sinon.assert.calledWithExactly(exitSpy, 1);
    sinon.assert.calledOnce(loggerMock.error);
    done();
  });
  it('should return parsed value of pollingDelay from environment', (done) => {
    const config = proxyquire('../../src/config/index.js', {
      './processWrapper': { exit: sinon.spy() },
      '../logger': createLoggerMock(),
      './environmentVariables': {
        thermostatIp: 'unset',
        pollingDelay: '7200'
      }
    });
    expect(config.pollingDelay).to.be.equal(7200);
    done();
  });
  it('should return 3000 when pollingDelay is unparsable in environment', (done) => {
    const exitSpy = sinon.spy();
    const loggerMock = createLoggerMock();
    const config = proxyquire('../../src/config/index.js', {
      './processWrapper': { exit: exitSpy },
      '../logger': loggerMock,
      './environmentVariables': {
        thermostatIp: 'valid',
        pollingDelay: 'garbage'
      }
    });
    expect(config.pollingDelay).to.be.equal(3000);
    sinon.assert.calledOnce(loggerMock.info);
    done();
  });
  it('should return 3000 if pollingDelay is missing from environment', (done) => {
    const config = proxyquire('../../src/config/index.js', {
      './processWrapper': { exit: sinon.spy() },
      '../logger': createLoggerMock(),
      './environmentVariables': {
        thermostatIp: 'valid'
      }
    });
    expect(config.pollingDelay).to.be.equal(3000);
    done();
  });
});
