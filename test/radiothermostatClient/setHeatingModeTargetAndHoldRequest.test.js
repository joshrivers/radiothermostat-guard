'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('Radiothermostat Client module setHeatingModeTargetAndHoldRequest', () => {
  const createStubs = () => ({
    'request-promise': sinon.stub()
  });
  it('should return a request function', (done) => {
    const clientFactory = proxyquire('../../src/radiothermostatClient/setHeatingModeTargetAndHoldRequest.js', createStubs());
    expect(clientFactory).to.be.an.instanceof(Function);
    done();
  });
  it('returns the result of request-promise post to of /tstat with JSON body', () => {
    const stubs = createStubs();
    const requestStub = stubs['request-promise'];
    requestStub.resolves('thermostat response');
    const setHeating = proxyquire('../../src/radiothermostatClient/setHeatingModeTargetAndHoldRequest.js', stubs);
    return setHeating('host.name', 76)
      .then((result) => {
        sinon.assert.calledOnce(requestStub);
        sinon.assert.calledWithExactly(requestStub, {
          method: 'POST',
          uri: 'http://host.name/tstat',
          body: { tmode: 1, t_heat: 76, hold: 1 },
          json: true,
        });
        expect(result).to.equal('thermostat response');
      });
  });
});
