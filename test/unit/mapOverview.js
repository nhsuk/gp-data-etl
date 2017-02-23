const chai = require('chai');
const mapOverview = require('../../app/lib/mappers/mapOverview');
const rawOverview = require('../resources/overview.json');

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
  });
});
