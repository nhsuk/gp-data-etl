const chai = require('chai');
const gpStore = require('../../app/lib/gpStore');

const expect = chai.expect;

describe('gpStore', () => {
  describe('getFailedIds', () => {
    it('should return failed IDs ', () => {
      gpStore.addFailedId(123, 'page', '500');
      gpStore.addFailedId(456, 'services', '404');
      const failedIds = gpStore.getFailedIds();
      expect(failedIds[0]).to.be.equal('123');
      expect(failedIds[1]).to.be.equal('456');
    });
  });
});
