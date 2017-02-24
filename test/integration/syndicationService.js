const service = require('../../app/lib/syndicationService');

describe('syndicationService', () => {
  it('should call Practice Summary XML page', (done) => {
    service.getPracticeSummaryPage(1).then(() => done());
  });
  it('should call API Overview XML page', (done) => {
    service.getOverviewPage(17307).then(() => done());
  });
  it('should return error for unknown ID', (done) => {
    service.getOverviewPage('notANumber').catch(() => done());
  });
});
