const chai = require('chai');
const urlUtils = require('../../app/lib/urlUtils');

const expect = chai.expect;

describe('urlUtils', () => {
  describe('addProtocol', () => {
    it('should add http protocol to website when it has no protocol', () => {
      const protocollessUrl = 'www.someplace.known';
      const result = urlUtils.addProtocol(protocollessUrl);

      expect(result).to.be.equal(`http://${protocollessUrl}`);
    });

    it('should return no website when there is not one supplied', () => {
      const result = urlUtils.addProtocol(undefined);

      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.undefined;
    });

    it('should return the website unaltered when it has a protocol', () => {
      const urlWithProtocol = 'http://protocol.included.com';
      const result = urlUtils.addProtocol(urlWithProtocol);

      expect(result).to.be.equal(urlWithProtocol);
    });
  });
});
