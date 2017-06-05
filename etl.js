const requireEnv = require('require-environment-variables');

const gpStore = require('./app/lib/gpStore');
const populateIdListQueue = require('./app/lib/queues/populateIdListQueue');
const populatePracticeQueue = require('./app/lib/queues/populatePracticeQueue');
const service = require('./app/lib/syndicationService');
const mapTotalPages = require('./app/lib/mappers/mapTotalPages');
const log = require('./app/lib/logger');
const config = require('./app/lib/config');

requireEnv(['SYNDICATION_API_KEY']);

const WORKERS = 1;
let etlInProgress = false;

function clearState() {
  populateIdListQueue.clearState();
  gpStore.clearState();
}

function saveState() {
  populateIdListQueue.saveState();
  gpStore.saveState();
}
function getTotalPages() {
  return service.getPracticeSummaryPage(1).then(mapTotalPages);
}

function etlComplete() {
  gpStore.saveGPs();
  gpStore.saveSummary();
  clearState();
  etlInProgress = false;
}

function startRevisitFailuresQueue() {
  if (gpStore.getErorredIds().length > 0) {
    log.info('Revisiting failed IDs');
    populatePracticeQueue.startRetryQueue(WORKERS, etlComplete);
  } else {
    etlComplete();
  }
}

function startPopulatePracticeQueue() {
  populatePracticeQueue.start(WORKERS, startRevisitFailuresQueue);
}

function idQueueComplete() {
  saveState();
  log.info(`${gpStore.getIds().length} practices found`);
  startPopulatePracticeQueue();
}

function startIdQueue(totalPages) {
  populateIdListQueue.start(totalPages, WORKERS, idQueueComplete);
}

function handleError(err) {
  log.info(`processing failed: ${err}`);
}

function start() {
  if (process.argv[2] === 'small') {
    if (process.argv[3] === 'clear') {
      clearState();
    }
    // run with only a few pages, save every 10 records rather than 100
    config.saveEvery = 10;
    startIdQueue(3);
  } else {
    if (process.argv[2] === 'clear') {
      clearState();
    }
    getTotalPages().then(startIdQueue).catch(handleError);
  }

  process.on('SIGINT', () => {
    log.info('ETL cancelled');
    saveState();
    process.exit();
  });
}

function safeStart() {
  if (etlInProgress) {
    log.error('Etl already running');
  } else {
    etlInProgress = true;
    start();
  }
}

module.exports = {
  start: safeStart,
};
