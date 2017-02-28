const chai = require('chai');
const mapOverview = require('../../app/lib/mappers/mapOverview');
const rawOverview = require('../resources/overview.json');
const rawOverviewNoOpeningTimes = require('../resources/overview-no-opening-times.json');
const rawOverviewNoChoicesId = require('../resources/overview-no-choicesId.json');

const expect = chai.expect;

describe('overview mapper', () => {
  it('should select subset of full overview fields', () => {
    const overview = mapOverview(rawOverview);

    expect(overview.name).to.equal('Croft Medical Centre');
    expect(overview.choicesId).to.equal(36931);
    // eslint-disable-next-line no-underscore-dangle
    expect(overview.choicesId).to.equal(overview._id);
    expect(overview.syndicationId).to.equal(17307);
    expect(overview.odsCode).to.equal('M89012');

    // eslint-disable-next-line no-unused-expressions
    expect(overview.location).to.exist;
    expect(overview.location.type).to.equal('Point');
    expect(overview.location.latitude).to.equal(52.4778633117676);
    expect(overview.location.longitude).to.equal(-1.72773551940918);

    expect(overview.address.addressLines[0]).to.equal('Croft Medical centre');
    expect(overview.address.addressLines[1]).to.equal('1 Pomeroy Way');
    expect(overview.address.addressLines[2]).to.equal('Chelmsley Wood');
    expect(overview.address.addressLines[3]).to.equal('Birmingham');
    expect(overview.address.addressLines[4]).to.equal('West Midlands');
    expect(overview.address.postcode).to.equal('B37 7WB');

    expect(overview.contact.telephone).to.equal('0121 270 7180');
    expect(overview.contact.fax).to.equal('0121 770 0130');
    expect(overview.contact.email).to.equal('email@missing.com');

    /* eslint-disable no-unused-expressions */
    expect(overview.openingTimes).to.exist;
    expect(overview.openingTimes.reception).to.exist;
    expect(overview.openingTimes.surgery).to.exist;
    /* eslint-enable no-unused-expressions */
  });

  it('should gracefully handle missing opening times', () => {
    const overview = mapOverview(rawOverviewNoOpeningTimes);
    // eslint-disable-next-line no-unused-expressions
    expect(overview.openingTimes).to.be.undefined;
  });

  it('should throw exception for missing choices ID', () => {
    expect(() => mapOverview(rawOverviewNoChoicesId)).to.throw('No Choices ID found for http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/17307/overview');
  });
});
