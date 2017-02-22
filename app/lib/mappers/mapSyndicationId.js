const urlParser = require('../urlParser');

function matchSelfHref(link) {
  return link.$ && link.$.rel === 'self';
}

function getSyndicationId(links) {
  const href = links.find(matchSelfHref);
  if (href) {
    return urlParser.getSyndicationId(href.$.href);
  }
  return undefined;
}

function mapSyndicationId(fullPractice) {
  if (fullPractice) {
    return getSyndicationId(fullPractice.link);
  }
  return undefined;
}

module.exports = mapSyndicationId;
