const chai = require('chai');
const mapLocation = require('../../app/lib/mappers/mapLocation');

const expect = chai.expect;

describe('Location mapper', () => {
  it('should map lat and long', () => {
    const rawLocation = {
      latitude: '52.4778633117676',
      longitude: '-1.72773551940918',
    };

    const location = mapLocation(rawLocation);

    // eslint-disable-next-line no-unused-expressions
    expect(location).to.exist;
    expect(location.type).to.equal('Point');
    expect(location.coordinates[0]).to.equal(-1.72773551940918);
    expect(location.coordinates[1]).to.equal(52.4778633117676);
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
