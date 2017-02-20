const urlParser = require('../urlParser');

function createLocation(orgSummary) {
  return {
    address: orgSummary['s:address']['s:addressLine'],
    postcode: orgSummary['s:address']['s:postcode'],
    latitude: Number(orgSummary['s:geographicCoordinates']['s:latitude']),
    longitude: Number(orgSummary['s:geographicCoordinates']['s:longitude']),
  };
}

/* eslint-disable no-param-reassign */
function setOrgSummaryFields(practice, orgSummary) {
  practice.name = orgSummary['s:name'];
  practice.phone = orgSummary['s:phone'];
  practice.odsCode = orgSummary['s:odscode'];
  practice.location = createLocation(orgSummary);
}
/* eslint-enable no-param-reassign */

function matchAltHref(link) {
  return link.$ && link.$.rel === 'alternate';
}

function matchSelfHref(link) {
  return link.$ && link.$.rel === 'self';
}

function getChoicesId(links) {
  const href = links.find(matchAltHref);
  if (href) {
    return urlParser.getChoicesId(href.$.href);
  }
  return undefined;
}

function getSyndicationId(links) {
  const href = links.find(matchSelfHref);
  if (href) {
    return urlParser.getSyndicationId(href.$.href);
  }
  return undefined;
}

function mapPractice(fullPractice) {
  if (fullPractice) {
    const practice = {};
    practice.choicesId = getChoicesId(fullPractice.link);
    // eslint-disable-next-line no-underscore-dangle
    practice._id = practice.choicesId;
    practice.syndicationId = getSyndicationId(fullPractice.link);
    setOrgSummaryFields(practice, fullPractice.content['s:organisationSummary']);
    return practice;
  }
  return undefined;
}

module.exports = mapPractice;
