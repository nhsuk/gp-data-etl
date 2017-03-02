const xmlJsonHelper = require('../xmlJsonHelper');

const GP_COUNT = 's:gpcount';

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

function emptyObjectToUndefined(gpCounts) {
  return Object.keys(gpCounts).length > 0 ? gpCounts : undefined;
}

function mapGpCounts(rawCounts) {
  if (countSectionValid(rawCounts)) {
    const gpCounts = xmlJsonHelper.asArray(rawCounts[GP_COUNT]).reduce(mapGpCount, {});
    // ensure consitent return of undefined for no data
    return emptyObjectToUndefined(gpCounts);
  }
  return undefined;
}

module.exports = mapGpCounts;
