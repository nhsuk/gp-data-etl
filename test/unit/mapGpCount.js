const chai = require('chai');
const mapGpCounts = require('../../app/lib/mappers/mapGpCounts');
const rawCounts = require('../resources/gp-counts.json');
const rawCountsNonArray = require('../resources/gp-counts-non-array.json');

const expect = chai.expect;

describe('GP Counts mapper', () => {
  it('should map array of GP gender counts', () => {
    const counts = mapGpCounts(rawCounts);
    // eslint-disable-next-line no-unused-expressions
    expect(counts).to.exist;
    expect(counts.male).to.equal(2);
    expect(counts.female).to.equal(4);
  });
  it('should map field of GP gender counts', () => {
    const counts = mapGpCounts(rawCountsNonArray);
    // eslint-disable-next-line no-unused-expressions
    expect(counts).to.exist;
    expect(counts.male).to.equal(2);
  });

  it('should gracefully handle empty gp counts', () => {
    const counts = mapGpCounts({});
    // eslint-disable-next-line no-unused-expressions
    expect(counts).to.be.undefined;
  });

  it('should gracefully handle missing $', () => {
    const counts = mapGpCounts({ 's:gpcount': [{}] });
    // eslint-disable-next-line no-unused-expressions
    expect(counts).to.be.undefined;
  });

  it('should gracefully handle missing type', () => {
    const counts = mapGpCounts({ 's:gpcount': [{ $: {} }] });
    // eslint-disable-next-line no-unused-expressions
    expect(counts).to.be.undefined;
  });

  it('should gracefully handle empty gp counts', () => {
    const counts = mapGpCounts(undefined);
    // eslint-disable-next-line no-unused-expressions
    expect(counts).to.be.undefined;
  });
});
