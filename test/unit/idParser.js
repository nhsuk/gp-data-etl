const chai = require('chai');
const urlParser = require('../../app/lib/urlParser');

const validChoicesUrl = 'https://www.nhs.uk/Services/GP/Overview/DefaultView.aspx?id=36931';
const invalidChoicesUrl = 'https://www.nhs.uk/Services/GP/Overview/DefaultView.aspx';

const validSyndicationUrl = 'https://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/17307?apikey=CHANGEME';
const invalidSyndicationUrl = 'https://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/';

const validPageCountUrl = 'https://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/all?apikey=CHANGEME&amp;page=320';
const invalidPageCountUrl = 'https://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/all?apikey=CHANGEME&amp;';
const expect = chai.expect;

describe('parse choices ID', () => {
  it('should extract ID from valid URL', () => {
    const id = urlParser.getChoicesId(validChoicesUrl);
    expect(id).to.equal(36931);
  });

  it('should return undefined for invalid URL', () => {
    const id = urlParser.getChoicesId(invalidChoicesUrl);
    // eslint-disable-next-line no-unused-expressions
    expect(id).to.be.undefined;
  });
});

describe('parse syndication ID', () => {
  it('should extract ID from valid URL', () => {
    const id = urlParser.getSyndicationId(validSyndicationUrl);
    expect(id).to.equal(17307);
  });

  it('should return undefined for invalid URL', () => {
    const id = urlParser.getSyndicationId(invalidSyndicationUrl);
    // eslint-disable-next-line no-unused-expressions
    expect(id).to.be.undefined;
  });
});

describe('parse total page count', () => {
  it('should extract ID from valid URL', () => {
    const id = urlParser.getPageCount(validPageCountUrl);
    expect(id).to.equal(320);
  });

  it('should return undefined for invalid URL', () => {
    const id = urlParser.getPageCount(invalidPageCountUrl);
    // eslint-disable-next-line no-unused-expressions
    expect(id).to.be.undefined;
  });
});
