const service = require('../../app/lib/syndicationService');

describe('syndicationService', () => {
  it('should call API XML url', (done) => {
    service.getPracticePage(1).then(() => done());
  });
});
