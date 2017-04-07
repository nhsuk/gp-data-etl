const urlParser = require('../urlParser');
const utils = require('../utils');

function matchLastPage(link) {
  return utils.getAttribute(link, 'rel') === 'last';
}

function getTotalPages(links) {
  const lastPageLink = links.find(matchLastPage);
  if (lastPageLink) {
    return urlParser.getPageCount(utils.getAttribute(lastPageLink, 'href'));
  }
  throw new Error('Could not get page count');
}
function mapTotalPages(results) {
  return getTotalPages(results.feed.link);
}

module.exports = mapTotalPages;
