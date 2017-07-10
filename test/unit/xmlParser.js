const chai = require('chai');
const fs = require('fs');
const xmlParser = require('../../app/lib/utils/xmlParser');

const expect = chai.expect;

describe('xmlParser', () => {
  it('should convert xml to JSON', (done) => {
    const xml = fs.readFileSync('./test/resources/page1-results.xml');
    xmlParser(xml).then((result) => {
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.exist;
      done();
    });
  });
  it('should throw error for invalid xml', (done) => {
    xmlParser('notXml').catch((error) => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.exist;
      done();
    });
  });
});
