const utils = require('../utils');

function mapDoctors(rawDoctors) {
  return rawDoctors ? utils.asArray(rawDoctors.doctor) : [];
}

module.exports = mapDoctors;
