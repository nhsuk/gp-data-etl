const chai = require('chai');
const mapFacilities = require('../../app/lib/mappers/mapFacilities');
const rawFacilities = require('../resources/facilities.json');
const rawFacilitiesNoParking = require('../resources/facilities-no-parking.json');
const rawFacilitiesNoGroups = require('../resources/facilities-no-groups.json');

const expect = chai.expect;

describe('facilities mapper', () => {
  it('should gracefully handle missing parking section', () => {
    const facilities = mapFacilities(rawFacilitiesNoParking);
    /* eslint-disable no-unused-expressions */
    expect(facilities).to.exist;
    expect(facilities.accessibility).to.exist;
    expect(facilities.parking).to.be.undefined;
    /* eslint-enable no-unused-expressions */
  });

  it('should gracefully handle missing groups section', () => {
    const facilities = mapFacilities(rawFacilitiesNoGroups);
    // eslint-disable-next-line no-unused-expressions
    expect(facilities).to.be.undefined;
  });

  it('should map parking and accessibility', () => {
    const facilities = mapFacilities(rawFacilities);
    // eslint-disable-next-line no-unused-expressions
    expect(facilities).to.exist;

    // eslint-disable-next-line no-unused-expressions
    expect(facilities.parking).to.exist;
    expect(facilities.parking.length).to.equal(3);
    expect(facilities.parking[0].name).to.equal('Car Parking');
    expect(facilities.parking[0].exists).to.equal('Yes');
    expect(facilities.parking.length).to.equal(3);
    expect(facilities.parking[1].name).to.equal('Cycle parking');
    expect(facilities.parking[1].exists).to.equal('NotSpecified');
    expect(facilities.parking.length).to.equal(3);
    expect(facilities.parking[2].name).to.equal('Disabled parking');
    expect(facilities.parking[2].exists).to.equal('NotSpecified');

    // eslint-disable-next-line no-unused-expressions
    expect(facilities.accessibility).to.exist;
    expect(facilities.accessibility.length).to.equal(8);
    expect(facilities.accessibility[0].name).to.equal('Wheelchair access');
    expect(facilities.accessibility[0].exists).to.equal('Yes');
    expect(facilities.accessibility.length).to.equal(8);
    expect(facilities.accessibility[1].name).to.equal('Step free access');
    expect(facilities.accessibility[1].exists).to.equal('Yes');
    expect(facilities.accessibility.length).to.equal(8);
    expect(facilities.accessibility[2].name).to.equal('Disabled WC');
    expect(facilities.accessibility[2].exists).to.equal('Yes');
    expect(facilities.accessibility.length).to.equal(8);
    expect(facilities.accessibility[3].name).to.equal('Braille translation service');
    expect(facilities.accessibility[3].exists).to.equal('NotSpecified');
  });
});
