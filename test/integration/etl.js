const nock = require('nock');
const fs = require('fs');

const etl = require('../../app/lib/etl');
const service = require('../../app/lib/syndicationService');

function readFile(path) {
  return fs.readFileSync(path, 'utf8');
}

const uri = `/all.xml?apikey=${process.env.SYNDICATION_API_KEY}&page=1`;

function stubNoResults() {
  const filePath = 'test/resources/zero-pages.xml';
  const stubbedData = readFile(filePath);
  nock(service.DEFAULT_URL)
    .get(uri)
    .reply(200, stubbedData);
}

function stubOnePageOfResults() {
  const filePath = 'test/resources/one-page.xml';
  const stubbedData = readFile(filePath);
  nock(service.DEFAULT_URL)
    .get(uri)
    .reply(200, stubbedData);
}

describe('ETL', function test() {
  this.timeout(5000);
  it('should complete ETL if no results', (done) => {
    stubNoResults();
    etl.start(done);
  });

  it('should complete ETL if one page of results', (done) => {
    stubOnePageOfResults();
    etl.start(done);
  });

  afterEach(() => {
    nock.cleanAll();
  });
});

