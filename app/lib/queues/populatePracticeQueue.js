const async = require('async');
const log = require('../logger');
const mapOverview = require('../mappers/mapOverview');
const mapFacilities = require('../mappers/mapFacilities');
const mapServices = require('../mappers/mapServices');
const service = require('../syndicationService');
const gpStore = require('../gpStore');
const limiter = require('../limiter');
const config = require('../config');

const steps = ['overview', 'facilities', 'services'];
const numberOfSteps = steps.length;
let hitsPerWorker;
let count = 0;

function handleError(err, id) {
  gpStore.addFailedId(id);
  log.error(`Error processing syndication ID ${id}: ${err}`);
}

function swallow404(page, err, gp, id) {
  if (err.message.includes(' 404')) {
    log.error(`No ${page} for syndication ID ${id}: ${err}`);
    gpStore.addFailedId(`${id}:${page}`);
    return gp;
  }
  throw err;
}

function addFacilities(gp, id) {
  return service.getFacilitiesPage(id).then(mapFacilities).then((facilities) => {
    // eslint-disable-next-line no-param-reassign
    gp.facilities = facilities;
    return gp;
  }).catch(err => swallow404('facilities', err, gp, id));
}

function addServices(gp, id) {
  return service.getServicesPage(id).then(mapServices).then((services) => {
    // eslint-disable-next-line no-param-reassign
    gp.services = services;
    return gp;
  }).catch(err => swallow404('services', err, gp, id));
}

function populatePractice(id) {
  return service.getOverviewPage(id)
    .then(mapOverview)
    .then(gp => addFacilities(gp, id))
    .then(gp => addServices(gp, id))
    .then(gpStore.addGP)
    .catch(err => handleError(err, id));
}

function pageParsed(id) {
  return gpStore.getGP(id);
}

function savePeriodically() {
  if (count % config.saveEvery === 0) {
    gpStore.saveState();
  }
}

function processQueueItem(task, callback) {
  count += 1;
  if (pageParsed(task.id)) {
    log.info(`skipping ${task.id}, already loaded`);
    callback();
  } else {
    savePeriodically();
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
  count = 0;
  hitsPerWorker = config.hitsPerHour / (workers * numberOfSteps);
  const q = async.queue(processQueueItem, workers);
  queueSyndicationIds(q);
  q.drain = drain;
}

module.exports = {
  start,
};
