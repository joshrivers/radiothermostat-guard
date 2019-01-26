'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('AutoHeatCool Get Current Auto Status Module', () => {
  it('should return a retrieval function', (done) => {
    const getCurrentAutoStatus = proxyquire('../../src/autoHeatCool/getCurrentAutoStatus', {
      './configuredRadioThermostatClient': {}
    });
    expect(getCurrentAutoStatus).to.be.an.instanceof(Function);
    done();
  });
  it('should get tstate pass through calculate status and return the result', async () => {
    const tstate = {
      t_silliness: 'walks'
    };
    const tstatMock = sinon.stub().resolves(tstate);
    const autoStatus = {
      mode: 'A La'
    };
    const calcStatusMock = sinon.stub().returns(autoStatus);
    const getCurrentAutoStatus = proxyquire('../../src/autoHeatCool/getCurrentAutoStatus', {
      './configuredRadioThermostatClient': { getCurrentState: tstatMock },
      './calculateStatusFromThermostatState': calcStatusMock
    });
    const resultStatus = await getCurrentAutoStatus();
    sinon.assert.calledOnce(tstatMock);
    sinon.assert.calledWithExactly(tstatMock);
    sinon.assert.calledOnce(calcStatusMock);
    sinon.assert.calledWithExactly(calcStatusMock, tstate);
    expect(resultStatus).to.equal(autoStatus);
  });
});
