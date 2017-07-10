const log = require('./utils/logger');
const fsHelper = require('./utils/fsHelper');

const ALL_TYPE = 'all';
const SERVICES_TYPE = 'services';
const FACILITIES_TYPE = 'facilities';

let syndicationIds = [];
let failedIds = {};
let gpCache = {};

function getGPs() {
  return Object.values(gpCache);
}

function getGP(syndicationId) {
  return gpCache[syndicationId];
}

function getIds() {
  return syndicationIds;
}

function getFailedIds() {
  return Object.keys(failedIds).map(n => Number(n));
}

function getFailedIdsByType(type) {
  const ids = [];
  Object.keys(failedIds).forEach((key) => {
    if (failedIds[key][type]) {
      ids.push(Number(key));
    }
  });
  return ids;
}

function getErorredIds() {
  return getFailedIdsByType(ALL_TYPE);
}

function clearFailedIds(ids) {
  if (ids) {
    ids.forEach(id => delete failedIds[id]);
  } else {
    failedIds = {};
  }
}

function addGP(gp) {
  gpCache[gp.syndicationId] = gp;
  return gp;
}

function addFailedId(id, area, message) {
  const failedId = failedIds[id] || {};
  failedId[area] = message;
  failedIds[id] = failedId;
  return id;
}

function addIds(gpsList) {
  syndicationIds = syndicationIds.concat(gpsList);
  return syndicationIds;
}

function saveState() {
  fsHelper.saveJsonSync(syndicationIds, 'syndicationIds');
  fsHelper.saveJsonSync(gpCache, 'gpCache');
}

function clearState() {
  syndicationIds = [];
  gpCache = {};
  clearFailedIds();
  saveState();
}

function loadState() {
  syndicationIds = fsHelper.loadJsonSync('syndicationIds') || [];
  gpCache = fsHelper.loadJsonSync('gpCache') || {};
}

function writeSubpageStatus(type) {
  const failedSubpageIds = getFailedIdsByType(type);
  if (failedSubpageIds.length > 0) {
    log.info(`${failedSubpageIds.length} have errors on the ${type} page`);
  }
}

function writeStatus() {
  const failedAllIds = getErorredIds();
  log.info(`${failedAllIds.length} syndication IDs failed: ${failedAllIds}`);
  writeSubpageStatus(FACILITIES_TYPE);
  writeSubpageStatus(SERVICES_TYPE);
  log.info('see summary.json file in \'site/json\' for full details');
}

function saveGPs() {
  writeStatus();
  fsHelper.saveJsonSync(getGPs(), 'gp-data');
}

function saveSummary() {
  const summary = {
    totalScanned: syndicationIds.length,
    totalErroredIds: getErorredIds().length,
    totalFacilitiesMissing: getFailedIdsByType(FACILITIES_TYPE).length,
    totalServicesMissing: getFailedIdsByType(SERVICES_TYPE).length,
    lastWritten: (new Date()).toLocaleString(),
    failedIds,
  };
  fsHelper.saveJsonSync(summary, 'summary');
}

loadState();

module.exports = {
  getIds,
  addIds,
  getGP,
  addGP,
  saveGPs,
  saveSummary,
  addFailedId,
  saveState,
  clearState,
  clearFailedIds,
  getFailedIds,
  getFailedIdsByType,
  getErorredIds,
  ALL_TYPE,
  SERVICES_TYPE,
  FACILITIES_TYPE,
};
