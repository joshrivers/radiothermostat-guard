'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
// const sinon = require('sinon');

describe('AutoHeatCool Last Enforced Decision Module', () => {
  it('should return a singleton storage function', (done) => {
    const lastEnforcedDecision = proxyquire('../../src/autoHeatCool/lastEnforcedDecision', {
    });
    expect(lastEnforcedDecision.storeEnforcedDecision).to.be.an.instanceof(Function);
    expect(lastEnforcedDecision.getLastEnforcedDecision).to.be.an.instanceof(Function);
    done();
  });
  it('should store an object for retrieval', (done) => {
    const lastEnforcedDecision = proxyquire('../../src/autoHeatCool/lastEnforcedDecision', {
    });
    const decision = {
      property: 'value'
    };
    expect(lastEnforcedDecision.getLastEnforcedDecision()).to.be.an('undefined');
    lastEnforcedDecision.storeEnforcedDecision(decision);
    expect(lastEnforcedDecision.getLastEnforcedDecision()).to.be.an('object');
    expect(lastEnforcedDecision.getLastEnforcedDecision()).to.deep.equal(decision);
    done();
  });
  it('should store a clone of decision, not the one passed', (done) => {
    const lastEnforcedDecision = proxyquire('../../src/autoHeatCool/lastEnforcedDecision', {
    });
    const decision = {
      shouldChange: true,
      mayHaveNesting: {
        with: 'temperature'
      }
    };
    expect(lastEnforcedDecision.getLastEnforcedDecision()).to.be.an('undefined');
    lastEnforcedDecision.storeEnforcedDecision(decision);
    expect(lastEnforcedDecision.getLastEnforcedDecision()).to.be.an('object');
    expect(lastEnforcedDecision.getLastEnforcedDecision()).not.to.equal(decision);
    expect(lastEnforcedDecision.getLastEnforcedDecision()).to.deep.equal(decision);
    done();
  });
});
