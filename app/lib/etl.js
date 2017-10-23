const requireEnv = require('require-environment-variables');
// requireEnvs must be at the top of the file as the azure-storage module uses the
// AZURE_STORAGE_CONNECTION_STRING variable on load
requireEnv(['AZURE_STORAGE_CONNECTION_STRING']);

const gpStore = require('./gpStore');
const populateIdListQueue = require('./queues/populateIdListQueue');
const populatePracticeQueue = require('./queues/populatePracticeQueue');
const service = require('./syndicationService');
const mapTotalPages = require('./mappers/mapTotalPages');
const log = require('./utils/logger');
const config = require('./config');
const uploadOutputToAzure = require('./uploadOutputToAzure');

requireEnv(['SYNDICATION_API_KEY']);

const WORKERS = 1;
let etlInProgress = false;
let completeCallback;

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

async function etlComplete() {
  gpStore.saveGPs();
  gpStore.saveSummary();
  clearState();
  await uploadOutputToAzure();
  log.info('ETL complete');
  etlInProgress = false;
  if (completeCallback) {
    completeCallback();
  }
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

function safeStart(callback) {
  completeCallback = callback;
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
