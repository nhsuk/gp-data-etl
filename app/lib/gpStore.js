const log = require('./logger');
const fsHelper = require('./fsHelper');

let syndicationIds = [];
const failedIds = [];
const gps = [];

function getGPs() {
  return gps;
}
function getIds() {
  return syndicationIds;
}

function addGP(gp) {
  gps.push(gp);
  return gps;
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
  fsHelper.saveJson(syndicationIds, 'syndicationIds');
}

function clearState() {
  syndicationIds = [];
  saveState();
}

function loadState() {
  syndicationIds = fsHelper.loadJson('syndicationIds.json') || [];
}

function saveGPs() {
  log.info(`The following syndication IDs failed: ${failedIds}`);
  fsHelper.saveJson(gps, 'gp-data');
}

loadState();

module.exports = {
  getIds,
  addIds,
  getGPs,
  addGP,
  saveGPs,
  addFailedId,
  saveState,
  clearState,
};
