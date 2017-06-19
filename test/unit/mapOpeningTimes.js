const chai = require('chai');
const mapOpeningTimes = require('../../app/lib/mappers/mapOpeningTimes').one;
const rawTimes = require('../resources/openingTimes.json');
const rawTimesMultiSession = require('../resources/openingTimesMultiSession.json');

const expect = chai.expect;

describe('opening times mapper', () => {
  it('should gracefully handle undefined opening times section', () => {
    const openingTimes = mapOpeningTimes(undefined);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes).to.be.undefined;
  });

  it('should gracefully handle missing daysOfWeek times section', () => {
    const openingTimes = mapOpeningTimes({});
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes).to.be.undefined;
  });

  it('should gracefully handle missing dayOfWeek section', () => {
    const openingTimes = mapOpeningTimes({ daysOfWeek: {} });
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes).to.be.undefined;
  });

  it('should gracefully handle missing dayName', () => {
    const badDay = {
      daysOfWeek: {
        dayOfWeek: [{}],
      },
    };
    const openingTimes = mapOpeningTimes(badDay);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes).to.be.empty;
  });

  it('should gracefully handle missing timeSessions', () => {
    const badDay = {
      daysOfWeek: {
        dayOfWeek: [{ dayName: 'Monday' }],
      },
    };
    const openingTimes = mapOpeningTimes(badDay);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes).to.be.empty;
  });

  it('should set missing day session to empty array (closed)', () => {
    const badDay = {
      daysOfWeek: {
        dayOfWeek: [{ dayName: 'Monday', timesSessions: {} }],
      },
    };
    const openingTimes = mapOpeningTimes(badDay);
    // eslint-disable-next-line no-unused-expressions
    expect(openingTimes.monday.length).to.equal(0);
  });

  it('should handle single opening times in a day', () => {
    const openingTimes = mapOpeningTimes(rawTimes);
    /* eslint-disable no-unused-expressions */
    expect(openingTimes.monday).to.exist;
    expect(openingTimes.tuesday).to.exist;
    expect(openingTimes.wednesday).to.exist;
    expect(openingTimes.thursday).to.exist;
    expect(openingTimes.friday).to.exist;
    expect(openingTimes.saturday).to.exist;
    expect(openingTimes.sunday).to.exist;
    /* eslint-enable no-unused-expressions */
    expect(openingTimes.monday[0].opens).to.equal('08:00');
    expect(openingTimes.monday[0].closes).to.equal('18:30');
    expect(openingTimes.tuesday[0].opens).to.equal('08:01');
    expect(openingTimes.tuesday[0].closes).to.equal('18:31');
    expect(openingTimes.wednesday[0].opens).to.equal('08:02');
    expect(openingTimes.wednesday[0].closes).to.equal('18:32');
    expect(openingTimes.thursday[0].opens).to.equal('08:03');
    expect(openingTimes.thursday[0].closes).to.equal('18:33');
    expect(openingTimes.friday[0].opens).to.equal('08:04');
    expect(openingTimes.friday[0].closes).to.equal('18:34');
    expect(openingTimes.saturday.length).to.equal(0);
    expect(openingTimes.sunday.length).to.equal(0);
  });

  it('should handle multiple opening times in a days', () => {
    const openingTimes = mapOpeningTimes(rawTimesMultiSession);
    /* eslint-disable no-unused-expressions */
    expect(openingTimes.monday).to.exist;
    expect(openingTimes.monday[0].opens).to.equal('08:30');
    expect(openingTimes.monday[0].closes).to.equal('12:30');
    expect(openingTimes.monday[1].opens).to.equal('16:00');
    expect(openingTimes.monday[1].closes).to.equal('18:00');
    expect(openingTimes.tuesday).to.exist;
    expect(openingTimes.tuesday[0].opens).to.equal('08:31');
    expect(openingTimes.tuesday[0].closes).to.equal('12:31');
    expect(openingTimes.tuesday[1].opens).to.equal('16:01');
    expect(openingTimes.tuesday[1].closes).to.equal('18:01');
    expect(openingTimes.wednesday).to.exist;
    expect(openingTimes.wednesday[0].opens).to.equal('08:32');
    expect(openingTimes.wednesday[0].closes).to.equal('12:32');
    expect(openingTimes.wednesday[1].opens).to.equal('16:32');
    expect(openingTimes.wednesday[1].closes).to.equal('18:32');
    expect(openingTimes.thursday).to.exist;
    expect(openingTimes.thursday[0].opens).to.equal('08:33');
    expect(openingTimes.thursday[0].closes).to.equal('12:33');
    expect(openingTimes.friday).to.exist;
    expect(openingTimes.friday[0].opens).to.equal('08:34');
    expect(openingTimes.friday[0].closes).to.equal('12:34');
    expect(openingTimes.friday[1].opens).to.equal('16:34');
    expect(openingTimes.friday[1].closes).to.equal('18:34');
    expect(openingTimes.saturday).to.exist;
    expect(openingTimes.sunday).to.exist;
    expect(openingTimes.saturday.length).to.equal(0);
    expect(openingTimes.sunday.length).to.equal(0);
    /* eslint-enable no-unused-expressions */
  });
});
