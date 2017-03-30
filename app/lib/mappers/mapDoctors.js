const utils = require('../utils');

const DOCTOR = 'doctor';

function mapDoctors(rawDoctors) {
  return rawDoctors ? utils.asArray(rawDoctors[DOCTOR]) : [];
}

module.exports = mapDoctors;
