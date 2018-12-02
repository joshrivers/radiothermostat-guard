'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Radiothermostat Client module', () => {
  const createStubs = () => ({
    './getCurrentStateRequest': sinon.stub(),
    './setHeatingModeTargetAndHoldRequest': sinon.stub(),
    './setCoolingModeTargetAndHoldRequest': sinon.stub()
  });
  it('should return a factory function', (done) => {
    const clientFactory = proxyquire('../../src/radiothermostatClient/index.js', createStubs());
    expect(clientFactory).to.be.an.instanceof(Function);
    done();
  });
  describe('Client factory', () => {
    it('should return an object with methods', (done) => {
      const clientFactory = proxyquire('../../src/radiothermostatClient/index.js', createStubs());
      const client = clientFactory('host.address');
      expect(client.getCurrentState).to.be.an.instanceof(Function);
      expect(client.setHeatingModeTargetAndHold).to.be.an.instanceof(Function);
      expect(client.setCoolingModeTargetAndHold).to.be.an.instanceof(Function);
      done();
    });
    it('should throw an exception when called with no thermostat address', (done) => {
      const clientFactory = proxyquire('../../src/radiothermostatClient/index.js', createStubs());
      expect(() => clientFactory()).to.throw(/Thermostat Client called with no address./);
      done();
    });
    describe('getCurrentState method', () => {
      it('should call getCurrentStateRequest module with thermostat address', (done) => {
        const stubs = createStubs();
        const clientFactory = proxyquire('../../src/radiothermostatClient/index.js', stubs);
        const client = clientFactory('host.address');
        stubs['./getCurrentStateRequest'].returns('returnValue');
        const result = client.getCurrentState();
        sinon.assert.calledOnce(stubs['./getCurrentStateRequest']);
        sinon.assert.calledWithExactly(stubs['./getCurrentStateRequest'], 'host.address');
        expect(result).to.be.equal('returnValue');
        done();
      });
    });
    describe('setHeatingModeTargetAndHold method', () => {
      it('should call setHeatingModeTargetAndHoldRequest module with thermostat address and temperature', (done) => {
        const stubs = createStubs();
        const clientFactory = proxyquire('../../src/radiothermostatClient/index.js', stubs);
        const client = clientFactory('host.address');
        stubs['./setHeatingModeTargetAndHoldRequest'].returns('returnValue');
        const result = client.setHeatingModeTargetAndHold(80);
        sinon.assert.calledOnce(stubs['./setHeatingModeTargetAndHoldRequest']);
        sinon.assert.calledWithExactly(stubs['./setHeatingModeTargetAndHoldRequest'], 'host.address', 80);
        expect(result).to.be.equal('returnValue');
        done();
      });
    });
    describe('setCoolingModeTargetAndHold method', () => {
      it('should call gsetCoolingModeTargetAndHoldRequest module with thermostat address and temperature', (done) => {
        const stubs = createStubs();
        const clientFactory = proxyquire('../../src/radiothermostatClient/index.js', stubs);
        const client = clientFactory('host.address');
        stubs['./setCoolingModeTargetAndHoldRequest'].returns('returnValue');
        const result = client.setCoolingModeTargetAndHold(60);
        sinon.assert.calledOnce(stubs['./setCoolingModeTargetAndHoldRequest']);
        sinon.assert.calledWithExactly(stubs['./setCoolingModeTargetAndHoldRequest'], 'host.address', 60);
        expect(result).to.be.equal('returnValue');
        done();
      });
    });
  });
});
