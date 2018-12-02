'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

describe('Environment variable accessor', () => {
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
  it('should return THERMOSTAT_IP as thermostatIp', (done) => {
    process.env.THERMOSTAT_IP = 'a.b.c.d';
    const environment = proxyquire('../../src/config/environmentVariables.js', { });
    expect(environment.thermostatIp).to.be.equal('a.b.c.d');
    done();
  });
  it('should return undefined when THERMOSTAT_IP unset', (done) => {
    const environment = proxyquire('../../src/config/environmentVariables.js', { });
    expect(environment.thermostatIp).to.be.equal(undefined);
    done();
  });
  it('should return POLLING_DELAY as pollingDelay', (done) => {
    process.env.POLLING_DELAY = '3600';
    const environment = proxyquire('../../src/config/environmentVariables.js', { });
    expect(environment.pollingDelay).to.be.equal('3600');
    done();
  });
  it('should return undefined when POLLING_DELAY unset', (done) => {
    const environment = proxyquire('../../src/config/environmentVariables.js', { });
    expect(environment.pollingDelay).to.be.equal(undefined);
    done();
  });
});
