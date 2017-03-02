const requireEnv = require('require-environment-variables');

const gpStore = require('./app/lib/gpStore');
const populateIdListQueue = require('./app/lib/queues/populateIdListQueue');
const populatePracticeQueue = require('./app/lib/queues/populatePracticeQueue');
const service = require('./app/lib/syndicationService');
const xmlParser = require('./app/lib/xmlParser');
const mapTotalPages = require('./app/lib/mappers/mapTotalPages');
const log = require('./app/lib/logger');

requireEnv(['SYNDICATION_API_KEY']);

const WORKERS = 1;

function clearState() {
  populateIdListQueue.clearState();
  gpStore.clearState();
}

function getTotalPages() {
  return service.getPracticeSummaryPage(1).then(xmlParser).then(mapTotalPages);
}

function etlComplete() {
  gpStore.saveGPs();
  clearState();
}

function startPopulatePracticeQueue() {
  populatePracticeQueue.start(WORKERS, etlComplete);
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
  if (process.argv[3] === 'clear') {
    clearState();
  }
  // run with only a few pages
  startIdQueue(3);
} else {
  getTotalPages().then(startIdQueue).catch(handleError);
}

process.on('SIGINT', () => {
  log.info('ETL cancelled');
  gpStore.saveState();
  populateIdListQueue.saveState();
  process.exit();
});
