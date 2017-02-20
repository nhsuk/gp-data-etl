const chai = require('chai');
const mapPractice = require('../../app/lib/mappers/mapPracticeSummary');
const fullPractice = require('../resources/gp-practice.json');

const expect = chai.expect;

describe('practice summary mapper', () => {
  it('should select subset of full practice fields', () => {
    const practice = mapPractice(fullPractice);
    // eslint-disable-next-line no-unused-expressions
    expect(practice).to.exist;
    expect(practice.name).to.equal('Croft Medical Centre');
    expect(practice.choicesId).to.equal(36931);
     // eslint-disable-next-line no-underscore-dangle
    expect(practice.choicesId).to.equal(practice._id);
    expect(practice.syndicationId).to.equal(17307);
    expect(practice.odsCode).to.equal('M89012');
    // eslint-disable-next-line no-unused-expressions
    expect(practice.location).to.exist;
    expect(practice.location.address[0]).to.equal('Croft Medical centre');
    expect(practice.location.address[1]).to.equal('1 Pomeroy Way');
    expect(practice.location.address[2]).to.equal('Chelmsley Wood');
    expect(practice.location.address[3]).to.equal('Birmingham');
    expect(practice.location.address[4]).to.equal('West Midlands');
    expect(practice.location.postcode).to.equal('B37 7WB');
    expect(practice.location.latitude).to.equal(52.4778633117676);
    expect(practice.location.longitude).to.equal(-1.72773551940918);
    expect(practice.phone).to.equal('0121 270 7180');
  });
});
