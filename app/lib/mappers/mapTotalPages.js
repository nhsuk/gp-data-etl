const urlParser = require('../urlParser');

function matchLastPage(link) {
  return link.$ && link.$.rel === 'last';
}

function getTotalPages(links) {
  const lastPageUrl = links.find(matchLastPage);
  if (lastPageUrl) {
    return urlParser.getPageCount(lastPageUrl.$.href);
  }
  throw new Error('Could not get page count');
}
function mapTotalPages(results) {
  return getTotalPages(results.feed.link);
}

module.exports = mapTotalPages;
