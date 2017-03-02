const xmlJsonHelper = require('../xmlJsonHelper');

const DOCTOR = 's:doctor';

function mapDoctors(rawDoctors) {
  return rawDoctors ? xmlJsonHelper.asArray(rawDoctors[DOCTOR]) : [];
}

module.exports = mapDoctors;
