const utils = require('../utils');

const DOCTOR = 's:doctor';

function mapDoctors(rawDoctors) {
  return rawDoctors ? utils.asArray(rawDoctors[DOCTOR]) : [];
}

module.exports = mapDoctors;
