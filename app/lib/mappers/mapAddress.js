const utils = require('../utils');

const ADDRESS_LINE = 'addressLine';
const POSTCODE = 'postcode';

function createAddress(rawAddress) {
  return {
    addressLines: utils.asArray(rawAddress[ADDRESS_LINE]),
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
