const chai = require('chai');
const mapServices = require('../../app/lib/mappers/mapServices');
const rawServices = require('../resources/services.json');
const rawServicesNoEntry = require('../resources/services-no-entry.json');

const expect = chai.expect;

describe('services mapper', () => {
  it('should gracefully handle missing services section', () => {
    const services = mapServices(rawServicesNoEntry);
    // eslint-disable-next-line no-unused-expressions
    expect(services).to.exist;
    expect(services.entries.length).to.equal(0);
  });

  it('should map services sections', () => {
    const services = mapServices(rawServices);
    // eslint-disable-next-line no-unused-expressions
    expect(services).to.exist;
    // eslint-disable-next-line no-unused-expressions
    expect(services.epsEnabled).to.be.true;
    expect(services.moreInformation).to.equal('Extended Surgery, Mondays from 06.30pm - 8.30pm.');
    expect(services.entries.length).to.equal(2);

    expect(services.entries[0].title).to.equal('Service 1');
    expect(services.entries[0].code).to.equal('SRV01');
    expect(services.entries[0].availabilityTimes).to.equal('times');
    // eslint-disable-next-line no-unused-expressions
    expect(services.entries[0].gpReferralRequired).to.be.false;

    expect(services.entries[1].title).to.equal('Diet specialist');
    expect(services.entries[1].code).to.equal('SRV02');
    expect(services.entries[1].availabilityTimes).to.equal('times 2');
    // eslint-disable-next-line no-unused-expressions
    expect(services.entries[1].gpReferralRequired).to.be.true;
  });
});
