const async = require('async');
const log = require('../logger');
const mapOverview = require('../mappers/mapOverview');
const mapFacilities = require('../mappers/mapFacilities');
const service = require('../syndicationService');
const gpStore = require('../gpStore');
const limiter = require('../limiter');

const HITS_PER_HOUR = 5000;
const steps = ['overview', 'facilities'];
const numberOfSteps = steps.length;
let hitsPerWorker;
let count = 0;

function handleError(err, id) {
  gpStore.addFailedId(id);
  log.error(`Error processing syndication ID ${id}: ${err}`);
}

function swallow404(err, gp, id) {
  if (err.message.includes(' 404')) {
    log.error(`No facilities for syndication ID ${id}: ${err}`);
    gpStore.addFailedId(`${id}:facilities`);
    return gp;
  }
  throw err;
}

function addFacilities(gp, id) {
  return service.getFacilitiesPage(id).then(mapFacilities).then((facilities) => {
    // eslint-disable-next-line no-param-reassign
    gp.facilities = facilities;
    return gp;
  }).catch(err => swallow404(err, gp, id));
}

function populatePractice(id) {
  return service.getOverviewPage(id)
    .then(mapOverview)
    .then(gp => addFacilities(gp, id))
    .then(gpStore.addGP)
    .catch(err => handleError(err, id));
}

function pageParsed(id) {
  return gpStore.getGP(id);
}

function saveEveryHundred() {
  if (count % 100 === 0) {
    gpStore.saveState();
  }
}

function processQueueItem(task, callback) {
  count += 1;
  if (pageParsed(task.id)) {
    log.info(`skipping ${task.id}, already loaded`);
    callback();
  } else {
    saveEveryHundred();
    log.info(`Populating practice ID ${task.id} ${count}/${gpStore.getIds().length}`);
    limiter(hitsPerWorker, () => populatePractice(task.id), callback);
  }
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
  hitsPerWorker = HITS_PER_HOUR / (workers * numberOfSteps);
  const q = async.queue(processQueueItem, workers);
  queueSyndicationIds(q);
  q.drain = drain;
}

module.exports = {
  start,
};
