const chai = require('chai');
const mapOverview = require('../../app/lib/mappers/mapOverview');
const rawOverview = require('../resources/overview.json');
const rawOverviewNoOpeningTimes = require('../resources/overview-no-opening-times.json');
const rawOverviewNoChoicesId = require('../resources/overview-no-choicesId.json');
const rawOverviewNoName = require('../resources/overview-no-name.json');
const rawOverviewNoContacts = require('../resources/overview-no-contacts.json');
const rawOverviewNoWebsiteProtocol = require('../resources/overview-no-website-protocol.json');

const expect = chai.expect;

describe('overview mapper', () => {
  it('should select subset of full overview fields', () => {
    const overview = mapOverview(rawOverview);

    expect(overview.name).to.equal('CROFT MEDICAL CENTRE');
    expect(overview.displayName).to.equal('Croft Medical Centre');
    expect(overview.choicesId).to.equal(36931);
    // eslint-disable-next-line no-underscore-dangle
    expect(overview.choicesId).to.equal(overview._id);
    expect(overview.syndicationId).to.equal(17307);
    expect(overview.odsCode).to.equal('M89012');
    // eslint-disable-next-line no-unused-expressions
    expect(overview.acceptingNewPatients).to.be.true;

    expect(overview.contact.telephone).to.equal('0121 270 7180');
    expect(overview.contact.fax).to.equal('0121 770 0130');
    expect(overview.contact.email).to.equal('email@missing.com');
    expect(overview.contact.website).to.equal('http://www.craigcroftmedicalcentre.co.uk/');

    /* eslint-disable no-unused-expressions */
    // below are tested in own unit tests
    expect(overview.location).to.exist;
    expect(overview.openingTimes).to.exist;
    expect(overview.address).to.exist;
    expect(overview.gpCounts).to.exist;
    expect(overview.doctors).to.exist;
    /* eslint-enable no-unused-expressions */
    expect(overview.doctors.length).to.equal(6);
  });

  it('should add an http protocol to website when there is no protocol', () => {
    const overview = mapOverview(rawOverviewNoWebsiteProtocol);

    expect(overview.contact.website).to.be.equal('http://www.craigcroftmedicalcentre.co.uk/');
  });

  it('should gracefully handle missing opening times', () => {
    const overview = mapOverview(rawOverviewNoOpeningTimes);
    // eslint-disable-next-line no-unused-expressions
    expect(overview.openingTimes).to.be.undefined;
  });

  it('should gracefully handle missing contact details', () => {
    const overview = mapOverview(rawOverviewNoContacts);
    // eslint-disable-next-line no-unused-expressions
    expect(overview.contact.website).to.exist;
  });

  it('should throw exception for missing choices ID', () => {
    expect(() => mapOverview(rawOverviewNoChoicesId)).to.throw('No Choices ID found for https://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/17307/overview');
  });

  it('should throw exception for missing Name', () => {
    expect(() => mapOverview(rawOverviewNoName)).to.throw('No Name found for https://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/17307/overview');
  });
});
