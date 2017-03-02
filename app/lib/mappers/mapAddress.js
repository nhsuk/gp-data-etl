const xmlJsonHelper = require('../xmlJsonHelper');

const ADDRESS_LINE = 's:addressLine';
const POSTCODE = 's:postcode';

function createAddress(rawAddress) {
  return {
    addressLines: xmlJsonHelper.asArray(rawAddress[ADDRESS_LINE]),
    postcode: rawAddress[POSTCODE],
  };
}

function addressValid(rawAddress) {
  return rawAddress && rawAddress[ADDRESS_LINE] && rawAddress[POSTCODE];
}

function mapAddress(rawAddress) {
  return addressValid(rawAddress) ? createAddress(rawAddress) : undefined;
}

module.exports = mapAddress;
