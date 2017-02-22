const async = require('async');

const log = require('../logger');

const mapOverview = require('../mappers/mapOverview');
const service = require('../syndicationService');
const xmlParser = require('../xmlParser');
const gpStore = require('../gpStore');

function handleError(err, id) {
  gpStore.addFailedId(id);
  log.error(`Error processing syndication ID ${id}: ${err}`);
}

function populatePractice(id) {
  return service.getOverviewPage(id)
  .then(xmlParser)
  .then(mapOverview)
  .then(gpStore.addGP)
  .catch(err => handleError(err, id));
}

function processQueueItem(task, callback) {
  log.info(`Populating practice ID ${task.id}`);
  populatePractice(task.id).then(callback);
}

function queueSyndicationIds(q) {
  gpStore.getIds().forEach((id) => {
    q.push({ id }, () => log.info(`${id} done`));
  });
}

function start(workers, drain) {
  const q = async.queue(processQueueItem, workers);
  queueSyndicationIds(q);
  q.drain = drain;
}

module.exports = { start };
