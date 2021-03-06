const async = require('async');

const gpStore = require('../gpStore');
const log = require('../utils/logger');
const service = require('../syndicationService');
const mapSyndicationId = require('../mappers/mapSyndicationId');
const fsHelper = require('../utils/fsHelper');

let processedPages = {};

function pageDone(pageNo) {
  processedPages[pageNo] = true;
}

function saveState() {
  fsHelper.saveJsonSync(processedPages, 'processedPages');
}

function clearState() {
  processedPages = {};
  fsHelper.saveJsonSync(processedPages, 'processedPages');
}

function loadState() {
  // there is a possibility that the same page will be processed twice
  // if the ETL is cancelled between adding the IDs to the gpStore, and
  // setting the processedPages. Duplicate IDs in the list will be ignored in the next queue
  // so this will not cause problems
  processedPages = fsHelper.loadJsonSync('processedPages') || {};
}

function handleError(err, pageNo) {
  log.error(`Error processing page ${pageNo}: ${err}`);
}

function loadPage(pageNo) {
  return service.getPracticeSummaryPage(pageNo)
    .then(mapSyndicationId.fromResults)
    .then(gpStore.addIds)
    .then(() => pageDone(pageNo))
    .catch(err => handleError(err, pageNo));
}

function pageParsed(pageNo) {
  return processedPages[pageNo] === true;
}

function processQueueItem(task, callback) {
  if (pageParsed(task.pageNo)) {
    log.info(`skipping ${task.pageNo}, already parsed`);
    callback();
  } else {
    log.info(`loading page ${task.pageNo}`);
    loadPage(task.pageNo).then(callback);
  }
}

function addPageToQueue(q, pageNo) {
  q.push({ pageNo }, () => log.info(`${pageNo} done`));
}

function start(totalPages, workers, drain) {
  if (totalPages > 0) {
    const q = async.queue(processQueueItem, workers);
    q.drain = drain;

    for (let i = 1; i <= totalPages; i++) {
      addPageToQueue(q, i);
    }
  } else {
    drain();
  }
}

loadState();

module.exports = {
  clearState,
  saveState,
  start,
};
