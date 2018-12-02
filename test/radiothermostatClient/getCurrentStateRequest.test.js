'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Radiothermostat Client module getCurrentStateRequest', () => {
  const createStubs = () => ({
    'request-promise': sinon.stub()
  });
  it('should return a request function', (done) => {
    const getState = proxyquire('../../src/radiothermostatClient/getCurrentStateRequest.js', createStubs());
    expect(getState).to.be.an.instanceof(Function);
    done();
  });
  it('returns the result of request-promise fetch of /tstat', () => {
    const stubs = createStubs();
    const requestStub = stubs['request-promise'];
    requestStub.resolves('thermostat response');
    const getState = proxyquire('../../src/radiothermostatClient/getCurrentStateRequest.js', stubs);
    return getState('host.name')
      .then((result) => {
        sinon.assert.calledOnce(requestStub);
        sinon.assert.calledWithExactly(requestStub, {
          uri: 'http://host.name/tstat',
          json: true
        });
        expect(result).to.equal('thermostat response');
      });
  });
});
