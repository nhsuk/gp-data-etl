const chai = require('chai');
const mapOpeningTimes = require('../../app/lib/mappers/mapOpeningTimes').all;

const allTimes = require('../resources/all-opening-times.json');
const allTimesNoAlterations = require('../resources/all-opening-times-no-alterations.json');
const allTimesAlterationsNoDate = require('../resources/all-opening-times-alterations-no-date.json');

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
    expect(openingTimes.alterations['2014-04-18'].length).to.equal(0);
    expect(openingTimes.alterations['2014-04-21'].length).to.equal(0);
    expect(openingTimes.alterations['2014-05-05'].length).to.equal(0);
    expect(openingTimes.alterations['2014-05-26'].length).to.equal(0);
    expect(openingTimes.alterations['2014-12-24'].length).to.equal(1);
    expect(openingTimes.alterations['2014-12-24'][0].opens).to.equal('08:30');
    expect(openingTimes.alterations['2014-12-24'][0].closes).to.equal('12:30');
    expect(openingTimes.alterations['2014-12-25'].length).to.equal(0);
    expect(openingTimes.alterations['2014-12-26'].length).to.equal(0);
  });

  it('should gracefully handle missing alterations', () => {
    const openingTimes = mapOpeningTimes(allTimesNoAlterations);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes.alterations).to.be.undefined;
  });

  it('should gracefully handle one missing date in alterations', () => {
    const openingTimes = mapOpeningTimes(allTimesAlterationsNoDate);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes.alterations).to.exist;
  });
});
