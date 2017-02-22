const service = require('../../app/lib/syndicationService');

describe('syndicationService', () => {
  it('should call API XML url', (done) => {
    service.getPracticeSummaryPage(1).then(() => done());
  });
  it('should call API Overview page XML url', (done) => {
    service.getOverviewPage(17307).then(() => done());
  });
});
