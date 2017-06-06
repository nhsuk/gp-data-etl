const chai = require('chai');
const gpStore = require('../../app/lib/gpStore');

const expect = chai.expect;

describe('gpStore', () => {
  describe('getFailedIds', () => {
    it('should return failed IDs', () => {
      gpStore.addFailedId(123, 'all', '500');
      gpStore.addFailedId(456, 'services', '404');
      const failedIds = gpStore.getFailedIds();
      expect(failedIds[0]).to.be.equal(123);
      expect(failedIds[1]).to.be.equal(456);
    });
  });
  describe('getFailedIdsByType', () => {
    it('should return failed IDs of provided type', () => {
      gpStore.addFailedId(123, 'all', '500');
      gpStore.addFailedId(456, 'services', '404');
      const failedIds = gpStore.getFailedIdsByType('services');
      expect(failedIds[0]).to.be.equal(456);
    });
  });

  describe('clearFailedIds', () => {
    it('should clear failed IDs if no parameter provided', () => {
      gpStore.addFailedId(123, 'all', '500');
      gpStore.addFailedId(456, 'services', '404');
      gpStore.clearFailedIds();
      const failedIds = gpStore.getFailedIds();
      expect(failedIds.length).to.equal(0);
    });
    it('should clear only IDs passed in as array parameter', () => {
      gpStore.addFailedId(123, 'all', '500');
      gpStore.addFailedId(456, 'services', '404');
      gpStore.addFailedId(789, 'facilities', '404');
      gpStore.clearFailedIds([123]);
      const failedIds = gpStore.getFailedIds();
      expect(failedIds.length).to.equal(2);
      expect(failedIds[0]).to.equal(456);
      expect(failedIds[1]).to.equal(789);
    });
  });

  describe('getGP', () => {
    it('should retrieve GP by syndication ID', () => {
      const syndicationId = 123;
      const gp = { syndicationId };
      gpStore.addGP(gp);
      expect(gpStore.getGP(syndicationId)).to.equal(gp);
    });
  });

  describe('addIds', () => {
    it('should add an array of syndication IDs to the store', () => {
      const syndicationIds = [123, 345, 567];
      gpStore.addIds(syndicationIds);
      expect(gpStore.getIds()).to.deep.equal(syndicationIds);
    });
  });
});
