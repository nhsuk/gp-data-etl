const choicesIdPattern = /.*id=(\d+)/i;
const syndicationIdPattern = /.*\/gppractices\/(\d+).*/i;
const pageCountPattern = /.*page=(\d+)/i;

function getMatchedNumber(url, pattern) {
  const match = pattern.exec(url);
  if (match && match.length === 2) {
    return Number(match[1]);
  }
  return undefined;
}

function getChoicesId(url) {
  return getMatchedNumber(url, choicesIdPattern);
}

function getSyndicationId(url) {
  return getMatchedNumber(url, syndicationIdPattern);
}

function getPageCount(url) {
  return getMatchedNumber(url, pageCountPattern);
}

module.exports = {
  getChoicesId,
  getPageCount,
  getSyndicationId,
};
