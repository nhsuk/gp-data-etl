const chai = require('chai');
const mapSyndicationId = require('../../app/lib/mappers/mapSyndicationId');
const rawAll = require('../resources/gp-all.json');
const rawSingle = require('../resources/gp-practice.json');
const rawSingleNoId = require('../resources/gp-practice-no-id.json');

const expect = chai.expect;

describe('syndicationId mapper', () => {
  it('should create list of syndication IDs', () => {
    const ids = mapSyndicationId.fromResults(rawAll);
    // eslint-disable-next-line no-unused-expressions
    expect(ids).to.exist;
    expect(ids.length).to.equal(30);
  });

  it('should gracefully handle no feed property', () => {
    const ids = mapSyndicationId.fromResults({});
    // eslint-disable-next-line no-unused-expressions
    expect(ids).to.exist;
    expect(ids.length).to.equal(0);
  });

  it('should gracefully handle no entry property', () => {
    const ids = mapSyndicationId.fromResults({ feed: {} });
    // eslint-disable-next-line no-unused-expressions
    expect(ids).to.exist;
    expect(ids.length).to.equal(0);
  });

  it('should gracefully handle entry is not an array', () => {
    const ids = mapSyndicationId.fromResults({ feed: { entry: {} } });
    // eslint-disable-next-line no-unused-expressions
    expect(ids).to.exist;
    expect(ids.length).to.equal(0);
  });

  it('should read syndication ID from single summary result', () => {
    const id = mapSyndicationId.fromSummary(rawSingle);
    // eslint-disable-next-line no-unused-expressions
    expect(id).to.exist;
    expect(id).to.equal(17307);
  });

  it('should gracefully handle missing id', () => {
    const id = mapSyndicationId.fromSummary(rawSingleNoId);
    // eslint-disable-next-line no-unused-expressions
    expect(id).to.be.undefined;
  });
});
