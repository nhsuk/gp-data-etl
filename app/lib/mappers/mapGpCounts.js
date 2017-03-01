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

function sectionToArray(rawCounts) {
  const rawCount = rawCounts[GP_COUNT];
  const countArray = rawCount.constructor === Array ? rawCount : [rawCount];
  return countArray;
}

function emptyObjectToUndefined(gpCounts) {
  return Object.keys(gpCounts).length > 0 ? gpCounts : undefined;
}

function mapGpCounts(rawCounts) {
  if (countSectionValid(rawCounts)) {
    const gpCounts = sectionToArray(rawCounts).reduce(mapGpCount, {});
    // ensure consitent return of undefined for no data
    return emptyObjectToUndefined(gpCounts);
  }
  return undefined;
}

module.exports = mapGpCounts;
