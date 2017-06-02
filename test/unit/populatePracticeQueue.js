const fs = require('fs');
const chai = require('chai');
const nock = require('nock');

const gpStore = require('../../app/lib/gpStore');
const syndicationService = require('../../app/lib/syndicationService');
const populatePracticeQueue = require('../../app/lib/queues/populatePracticeQueue');

const expect = chai.expect;

function readFile(path) {
  return fs.readFileSync(path, 'utf8');
}

function nockSuccess(id, page) {
  const filePath = `test/resources/${id}_${page}.xml`;
  const stubbedData = readFile(filePath);
  const uri = `/${id}/${page}.xml?apikey=${process.env.SYNDICATION_API_KEY}`;
  nock(syndicationService.DEFAULT_URL)
    .get(uri)
    .reply(200, stubbedData);
}

function nockError(id, page, error) {
  const uri = `/${id}/${page}.xml?apikey=${process.env.SYNDICATION_API_KEY}`;
  nock(syndicationService.DEFAULT_URL)
    .get(uri)
    .reply(error, 'page not found');
}

function nockHtmlResponse(id, page) {
  const uri = `/${id}/${page}.xml?apikey=${process.env.SYNDICATION_API_KEY}`;
  nock(syndicationService.DEFAULT_URL)
    .get(uri)
    .reply(200, '<html><head><title>page</title></head></html>');
}

describe('Populate Practice Queue', function test() {
  this.timeout(30000);
  beforeEach(() => {
    gpStore.clearState();
  });

  afterEach(() => {
    gpStore.clearState();
  });

  after(() => {
    nock.restore();
  });

  it('should process a valid practice', (done) => {
    const syndicationId = 3028;
    // arrrange
    nockSuccess(syndicationId, 'overview');
    nockSuccess(syndicationId, 'services');
    nockSuccess(syndicationId, 'facilities');
    gpStore.addIds([syndicationId]);
    // act
    populatePracticeQueue.start(1, () => {
      // assert
      const gp = gpStore.getGP(syndicationId);
      /* eslint-disable no-unused-expressions */
      expect(gp).to.exist;
      expect(gp.services).to.exist;
      expect(gp.facilities).to.exist;
      /* eslint-enable no-unused-expressions */
      done();
    });
  });

  it('should skip already processed practice', (done) => {
    const syndicationId = 3028;
    // arrrange
    nockSuccess(syndicationId, 'overview');
    nockSuccess(syndicationId, 'services');
    nockSuccess(syndicationId, 'facilities');
    gpStore.addIds([syndicationId, syndicationId]);
    // act
    populatePracticeQueue.start(1, () => {
      // assert
      const gp = gpStore.getGP(syndicationId);
      /* eslint-disable no-unused-expressions */
      expect(gp).to.exist;
      expect(gp.services).to.exist;
      expect(gp.facilities).to.exist;
      /* eslint-enable no-unused-expressions */
      done();
    });
  });

  it('should process a practice missing facilities', (done) => {
    const syndicationId = 4046;
    // arrrange
    nockSuccess(syndicationId, 'overview');
    nockSuccess(syndicationId, 'services');
    nockError(syndicationId, 'facilities', 404);
    // act
    gpStore.addIds([syndicationId]);
    populatePracticeQueue.start(1, () => {
      // assert
      const gp = gpStore.getGP(syndicationId);
      /* eslint-disable no-unused-expressions */
      expect(gp).to.exist;
      expect(gp.services).to.exist;
      expect(gp.facilities).to.not.exist;
      /* eslint-enable no-unused-expressions */
      done();
    });
  });

  it('should process a practice missing services', (done) => {
    const syndicationId = 3852;
    // arrrange
    nockSuccess(syndicationId, 'overview');
    nockError(syndicationId, 'services', 404);
    nockSuccess(syndicationId, 'facilities');
    // act
    gpStore.addIds([syndicationId]);
    populatePracticeQueue.start(1, () => {
      // assert
      const gp = gpStore.getGP(syndicationId);
      /* eslint-disable no-unused-expressions */
      expect(gp).to.exist;
      expect(gp.services).to.not.exist;
      expect(gp.facilities).to.exist;
      /* eslint-enable no-unused-expressions */
      done();
    });
  });

  it('should process a practice with an html page returned for services xml request', (done) => {
    const syndicationId = 14963;
    // arrrange
    nockSuccess(syndicationId, 'overview');
    nockHtmlResponse(syndicationId, 'services');
    nockSuccess(syndicationId, 'facilities');
    gpStore.addIds([syndicationId]);
    populatePracticeQueue.start(1, () => {
      const gp = gpStore.getGP(syndicationId);
      /* eslint-disable no-unused-expressions */
      expect(gp).to.exist;
      expect(gp.services).to.not.exist;
      expect(gp.facilities).to.exist;
      /* eslint-enable no-unused-expressions */
      done();
    });
  });

  it('should add id to error list on failure', (done) => {
    const syndicationId = 14963;
    // arrrange
    nockError(syndicationId, 'overview', 500);
    gpStore.addIds([syndicationId]);
    populatePracticeQueue.start(1, () => {
      const ids = gpStore.getFailedIds();
      expect(ids[0]).to.equal(syndicationId);
      done();
    });
  });

  it('should add id to error list on sub page failure', (done) => {
    const syndicationId = 4046;
    // arrrange
    nockSuccess(syndicationId, 'overview');
    nockSuccess(syndicationId, 'services');
    nockError(syndicationId, 'facilities', 500);
    gpStore.addIds([syndicationId]);
    populatePracticeQueue.start(1, () => {
      const ids = gpStore.getFailedIds();
      expect(ids[0]).to.equal(syndicationId);
      done();
    });
  });
});
