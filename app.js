const async = require('async');
const fs = require('fs');
const service = require('./app/lib/syndicationService');
const xmlParser = require('./app/lib/xmlParser');
const mapPractice = require('./app/lib/mapPractice');

const TOTAL_PAGES = 320;
const WORKERS = 10;

let gps = [];

function mapAll(results) {
  return results.feed && results.feed.entry && results.feed.entry.map(mapPractice);
}

function addToGpList(gpsList) {
  gps = gps.concat(gpsList);
  return gps;
}

function loadPage(pageNo) {
  return service.getPracticePage(pageNo).then(xmlParser)
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
/* eslint-enable no-console */

function startQueue() {
  const q = async.queue(processQueueItem, WORKERS);

  q.drain = saveGPs;

  for (let i = 1; i <= TOTAL_PAGES; i++) {
    addPageToQueue(q, i);
  }
}

startQueue();

