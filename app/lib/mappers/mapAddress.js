const utils = require('../utils/utils');

function createAddress(rawAddress) {
  return {
    addressLines: utils.asArray(rawAddress.addressLine),
    postcode: rawAddress.postcode,
  };
}

function addressValid(rawAddress) {
  return rawAddress && rawAddress.addressLine && rawAddress.postcode;
}

function mapAddress(rawAddress) {
  return addressValid(rawAddress) ? createAddress(rawAddress) : undefined;
}

module.exports = mapAddress;
