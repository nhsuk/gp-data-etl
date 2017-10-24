const fs = require('fs');
const chai = require('chai');
const nock = require('nock');

const populateIdListQueue = require('../../app/lib/queues/populateIdListQueue');

const gpStore = require('../../app/lib/gpStore');
const syndicationService = require('../../app/lib/syndicationService');

const expect = chai.expect;

function readFile(path) {
  return fs.readFileSync(path, 'utf8');
}

function nockOnePage() {
  const filePath = 'test/resources/page1-results.xml';
  const stubbedData = readFile(filePath);
  const uri = `/all.xml?apikey=${process.env.SYNDICATION_API_KEY}&page=1`;
  nock(syndicationService.DEFAULT_URL)
    .get(uri)
    .reply(200, stubbedData);
}

describe('Populate Practice Queue', function test() {
  this.timeout(5000);
  it('should call drain for zero total pages', (done) => {
    populateIdListQueue.start(0, 1, () => {
      done();
    });
  });

  it('should get 30 IDs from one page', (done) => {
    nockOnePage();
    gpStore.clearState();
    populateIdListQueue.start(1, 1, () => {
      expect(gpStore.getIds().length).to.equal(30);
      done();
    });
  });

  afterEach(() => {
    nock.cleanAll();
    gpStore.clearState();
  });
});
