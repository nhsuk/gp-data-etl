const urlParser = require('../urlParser');

function fromSummary(fullPractice) {
  return fullPractice && urlParser.getSyndicationId(fullPractice.id);
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
