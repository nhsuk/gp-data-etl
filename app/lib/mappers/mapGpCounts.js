const utils = require('../utils');

const GP_COUNT = 'gpcount';

function countSectionValid(rawCounts) {
  return rawCounts && rawCounts[GP_COUNT];
}

function mapGpCount(gpCount, rawGpCount) {
  if (rawGpCount.$ && rawGpCount.$.type) {
    // eslint-disable-next-line no-param-reassign
    gpCount[rawGpCount.$.type] = Number(rawGpCount._);
  }
  return gpCount;
}

function mapGpCounts(rawCounts) {
  if (countSectionValid(rawCounts)) {
    const gpCounts = utils.asArray(rawCounts[GP_COUNT]).reduce(mapGpCount, {});
    // ensure consitent return of undefined for no data
    return utils.emptyObjectToUndefined(gpCounts);
  }
  return undefined;
}

module.exports = mapGpCounts;
