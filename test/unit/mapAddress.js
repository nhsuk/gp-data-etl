const chai = require('chai');
const mapAddress = require('../../app/lib/mappers/mapAddress');

const expect = chai.expect;

describe('Address mapper', () => {
  it('should map address and postcode', () => {
    const rawAddress = {
      addressLine: [
        'Croft Medical centre',
        '1 Pomeroy Way',
        'Chelmsley Wood',
        'Birmingham',
        'West Midlands',
      ],
      postcode: 'B37 7WB',
    };

    const address = mapAddress(rawAddress);
    /* eslint-disable no-unused-expressions */
    expect(address).to.exist;
    expect(address.addressLines).to.exist;
    /* eslint-enable no-unused-expressions */
    expect(address.addressLines[0]).to.equal('Croft Medical centre');
    expect(address.addressLines[1]).to.equal('1 Pomeroy Way');
    expect(address.addressLines[2]).to.equal('Chelmsley Wood');
    expect(address.addressLines[3]).to.equal('Birmingham');
    expect(address.addressLines[4]).to.equal('West Midlands');
    expect(address.postcode).to.equal('B37 7WB');
  });

  it('should gracefully handle undefined address', () => {
    const address = mapAddress(undefined);
    // eslint-disable-next-line no-unused-expressions
    expect(address).to.be.undefined;
  });

  it('should gracefully handle empty address', () => {
    const address = mapAddress({});
    // eslint-disable-next-line no-unused-expressions
    expect(address).to.be.undefined;
  });
});
