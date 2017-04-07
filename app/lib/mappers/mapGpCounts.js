const utils = require('../utils');

function countSectionValid(rawCounts) {
  return rawCounts && rawCounts.gpcount;
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
    const gpCounts = utils.asArray(rawCounts.gpcount).reduce(mapGpCount, {});
    // ensure consitent return of undefined for no data
    return utils.emptyObjectToUndefined(gpCounts);
  }
  return undefined;
}

module.exports = mapGpCounts;
