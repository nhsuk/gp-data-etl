const fs = require('fs');
const log = require('./logger');

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

function saveGPs() {
  log.info(`The following syndication IDs failed: ${failedIds}`);
  const json = JSON.stringify(gps);
  fs.writeFile('gp-data.json', json, 'utf8', () => log.info('File saved'));
}

module.exports = {
  getIds,
  addIds,
  getGPs,
  addGP,
  saveGPs,
  addFailedId,
};
