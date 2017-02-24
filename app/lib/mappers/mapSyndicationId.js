const urlParser = require('../urlParser');
const log = require('../logger');

function fromSummary(fullPractice) {
  return fullPractice ? urlParser.getSyndicationId(fullPractice.id) :
         log.error(`No id found in ${fullPractice.id}`);
}

function fromResults(results) {
  return results.feed && results.feed.entry &&
         results.feed.entry.constructor === Array ?
         results.feed.entry.map(fromSummary) : [];
}

module.exports = {
  fromResults,
  fromSummary,
};
