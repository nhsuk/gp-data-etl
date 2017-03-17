const log = require('./logger');
const fsHelper = require('./fsHelper');

let syndicationIds = [];
const failedIds = [];

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

function addGP(gp) {
  gpCache[gp.syndicationId] = gp;
  return gp;
}

function addFailedId(id) {
  failedIds.push(id);
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
  saveState();
}

function loadState() {
  syndicationIds = fsHelper.loadJsonSync('syndicationIds') || [];
  gpCache = fsHelper.loadJsonSync('gpCache') || {};
}

function saveGPs() {
  log.info(`The following syndication IDs failed: ${failedIds}`);
  fsHelper.saveJsonSync(getGPs(), 'gp-data');
}

loadState();

module.exports = {
  getIds,
  addIds,
  getGPs,
  getGP,
  addGP,
  saveGPs,
  addFailedId,
  saveState,
  clearState,
};
