const chai = require('chai');
const mapOpeningTimes = require('../../app/lib/mappers/mapOpeningTimes').all;

const allTimes = require('../resources/all-opening-times.json');
const allTimesNoAdditional = require('../resources/all-opening-times-no-alterations.json');

const expect = chai.expect;

describe('all opening times mapper', () => {
  it('should gracefully handle undefined opening times section', () => {
    const openingTimes = mapOpeningTimes(undefined);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes).to.be.empty;
  });

  it('should map reception, surgery and alterations', () => {
    const openingTimes = mapOpeningTimes(allTimes);
    /* eslint-disable no-unused-expressions */
    expect(openingTimes).to.exist;
    expect(openingTimes.reception).to.exist;
    expect(openingTimes.surgery).to.exist;
    expect(openingTimes.alterations).to.exist;
    /* eslint-enable no-unused-expressions */
  });

  it('should gracefully handle missing alterations', () => {
    const openingTimes = mapOpeningTimes(allTimesNoAdditional);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes.alterations).to.be.undefined;
  });
});
