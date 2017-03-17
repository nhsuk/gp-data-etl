const service = require('../../app/lib/syndicationService');
const chai = require('chai');

const expect = chai.expect;

describe('syndicationService', () => {
  it('should call Practice Summary page', (done) => {
    service.getPracticeSummaryPage(1).then(() => done());
  });

  it('should call API Overview page', (done) => {
    service.getOverviewPage(17307).then(() => done());
  });

  it('should call API Facilities page', (done) => {
    service.getFacilitiesPage(17307).then(() => done());
  });

  it('should return 404 for no facilities', (done) => {
    service.getFacilitiesPage('14972').catch((err) => {
      expect(err.message).to.contain(' 404');
      done();
    });
  });

  it('should return error for unknown ID', (done) => {
    service.getOverviewPage('notANumber').catch(() => done());
  });
});
