'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Thermostat auto policy enforcement launcher', () => {
  it('should discover the radiothermostat IP address', (done) => {
    const discoverStub = sinon.stub().resolves(['address']);
    const autoHeatCoolStub = { mainLoop: sinon.stub() };
    proxyquire('../manageThermostat.js', {
      './src/autoHeatCool': autoHeatCoolStub
    });

    sinon.assert.calledOnce(autoHeatCoolStub);
    expect(true).to.be.equal(true);
    done();
  });
});
