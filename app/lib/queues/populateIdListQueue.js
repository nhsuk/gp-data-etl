const async = require('async');

const gpStore = require('../gpStore');
const log = require('../logger');
const service = require('../syndicationService');
const xmlParser = require('../xmlParser');
const mapSyndicationId = require('../mappers/mapSyndicationId');
const fsHelper = require('../fsHelper');

let processedPages = {};

function pageDone(pageNo) {
  processedPages[pageNo] = true;
}

function saveState() {
  fsHelper.saveJson(processedPages, 'processedPages');
}

function clearState() {
  processedPages = {};
  fsHelper.saveJson(processedPages, 'processedPages');
}

function loadState() {
  processedPages = fsHelper.loadJson('processedPages.json') || {};
}

function handleError(err, pageNo) {
  log.error(`Error processing page ${pageNo}: ${err}`);
}

function loadPage(pageNo) {
  return service.getPracticeSummaryPage(pageNo)
    .then(xmlParser)
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
  const q = async.queue(processQueueItem, workers);

  q.drain = drain;

  for (let i = 1; i <= totalPages; i++) {
    addPageToQueue(q, i);
  }
}

loadState();

module.exports = {
  start,
  saveState,
  clearState,
};
