'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Unused radiothermostat HTTP API Facade', () => {
  it('should discover the radiothermostat IP address', (done) => {
    const discoverStub = sinon.stub().resolves(['address']);
    proxyquire('../index.js', {
      express: sinon.stub().returns({
        get: sinon.stub(),
        listen: sinon.stub()
      }),
      './forecastio': sinon.stub(),
      './radiothermostat': { discover: discoverStub },
      './src/logger': { info: sinon.stub() }
    });

    sinon.assert.calledOnce(discoverStub);
    expect(true).to.be.equal(true);
    done();
  });
});
