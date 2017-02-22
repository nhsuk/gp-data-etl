const async = require('async');

const gpStore = require('../gpStore');
const log = require('../logger');
const service = require('../syndicationService');
const xmlParser = require('../xmlParser');
const mapSyndicationId = require('../mappers/mapSyndicationId');

function mapAll(results) {
  return results.feed && results.feed.entry && results.feed.entry.map(mapSyndicationId);
}
function handleError(err, pageNo) {
  log.error(`Error processing page ${pageNo}: ${err}`);
}

function loadPage(pageNo) {
  return service.getPracticeSummaryPage(pageNo)
  .then(xmlParser)
  .then(mapAll).then(gpStore.addIds)
  .catch(err => handleError(err, pageNo));
}

function processQueueItem(task, callback) {
  log.info(`loading page ${task.pageNo}`);
  loadPage(task.pageNo).then(callback);
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

module.exports = { start };
