const requireEnv = require('require-environment-variables');

const gpStore = require('./app/lib/gpStore');
const populateIdListQueue = require('./app/lib/queues/populateIdListQueue');
const populatePracticeQueue = require('./app/lib/queues/populatePracticeQueue');
const service = require('./app/lib/syndicationService');
const xmlParser = require('./app/lib/xmlParser');
const mapTotalPages = require('./app/lib/mappers/mapTotalPages');
const log = require('./app/lib/logger');

requireEnv(['SYNDICATION_API_KEY']);

const WORKERS = 10;

function getTotalPages() {
  return service.getPracticeSummaryPage(1).then(xmlParser).then(mapTotalPages);
}

function startPopulatePracticeQueue() {
  populatePracticeQueue.start(WORKERS, gpStore.saveGPs);
}

function idQueueComplete() {
  log.info(`${gpStore.getIds().length} practices found`);
  startPopulatePracticeQueue();
}

function startIdQueue(totalPages) {
  populateIdListQueue.start(totalPages, WORKERS, idQueueComplete);
}

function handleError(err) {
  log.info(`processing failed: ${err}`);
}

if (process.argv[2] === 'small') {
  // run with only a few pages
  startIdQueue(3);
} else {
  getTotalPages().then(startIdQueue).catch(handleError);
}
