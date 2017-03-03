const async = require('async');
const log = require('../logger');
const mapOverview = require('../mappers/mapOverview');
const service = require('../syndicationService');
const xmlParser = require('../xmlParser');
const gpStore = require('../gpStore');
const limiter = require('../limiter');

const HITS_PER_HOUR = 5000;
let hitsPerWorker;
let count = 0;

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
  count += 1;
  log.info(`Populating practice ID ${task.id} ${count}/${gpStore.getIds().length}`);
  limiter(hitsPerWorker, () => populatePractice(task.id), callback);
}

function queueSyndicationIds(q) {
  gpStore.getIds().forEach((id) => {
    if (id) {
      q.push({ id }, () => log.info(`${id} done`));
    } else {
      log.error('Undefined ID in syndication list');
    }
  });
}

function start(workers, drain) {
  hitsPerWorker = HITS_PER_HOUR / workers;
  const q = async.queue(processQueueItem, workers);
  queueSyndicationIds(q);
  q.drain = drain;
}

module.exports = { start };
