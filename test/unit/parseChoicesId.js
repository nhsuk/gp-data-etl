const chai = require('chai');
const parseChoicesId = require('../../app/lib/parseChoicesId');

const validUrl = 'http://www.nhs.uk/Services/GP/Overview/DefaultView.aspx?id=36931';
const invalidUrl = 'http://www.nhs.uk/Services/GP/Overview/DefaultView.aspx';
const expect = chai.expect;

describe('parse choices ID', () => {
  it('should extract ID from valid URL', () => {
    const id = parseChoicesId(validUrl);
    expect(id).to.equal(36931);
  });
  it('should return undefined for invalid URL', () => {
    const id = parseChoicesId(invalidUrl);
    // eslint-disable-next-line no-unused-expressions
    expect(id).to.be.undefined;
  });
});
