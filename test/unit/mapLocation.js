const chai = require('chai');
const mapLocation = require('../../app/lib/mappers/mapLocation');

const expect = chai.expect;

describe('Location mapper', () => {
  it('should map lat and long', () => {
    const rawLocation = {
      's:longitude': '-1.72773551940918',
      's:latitude': '52.4778633117676',
    };

    const location = mapLocation(rawLocation);

    // eslint-disable-next-line no-unused-expressions
    expect(location).to.exist;
    expect(location.type).to.equal('Point');
    expect(location.latitude).to.equal(52.4778633117676);
    expect(location.longitude).to.equal(-1.72773551940918);
  });

  it('should gracefully handle undefined location', () => {
    const location = mapLocation(undefined);
    // eslint-disable-next-line no-unused-expressions
    expect(location).to.be.undefined;
  });

  it('should gracefully handle empty location', () => {
    const location = mapLocation({});
    // eslint-disable-next-line no-unused-expressions
    expect(location).to.be.undefined;
  });
});
