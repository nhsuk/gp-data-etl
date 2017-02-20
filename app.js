const async = require('async');
const fs = require('fs');
const service = require('./app/lib/syndicationService');
const xmlParser = require('./app/lib/xmlParser');
const mapPractice = require('./app/lib/mappers/mapPracticeSummary');
const mapTotalPages = require('./app/lib/mappers/mapTotalPages');

const WORKERS = 10;

let gps = [];

function getTotalPages() {
  return service.getPracticeSummaryPage(1).then(xmlParser).then(mapTotalPages);
}

function mapAll(results) {
  return results.feed && results.feed.entry && results.feed.entry.map(mapPractice);
}

function addToGpList(gpsList) {
  gps = gps.concat(gpsList);
  return gps;
}

function loadPage(pageNo) {
  return service.getPracticeSummaryPage(pageNo).then(xmlParser)
    .then(mapAll).then(addToGpList);
}
/* eslint-disable no-console */
function addPageToQueue(q, pageNo) {
  q.push({ pageNo }, () => console.log(`${pageNo} done`));
}

function saveGPs() {
  const json = JSON.stringify(gps);
  fs.writeFile('gp-data.json', json, 'utf8', () => console.log('File saved'));
}

function processQueueItem(task, callback) {
  console.log(`loading page ${task.pageNo}`);
  loadPage(task.pageNo).then(callback);
}

function handleError(err) {
  console.log(`processing failed: ${err}`);
}
/* eslint-enable no-console */

function startQueue(totalPages) {
  const q = async.queue(processQueueItem, WORKERS);

  q.drain = saveGPs;

  for (let i = 1; i <= totalPages; i++) {
    addPageToQueue(q, i);
  }
}

getTotalPages().then(startQueue).catch(handleError);
