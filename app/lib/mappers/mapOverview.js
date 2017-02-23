const reducer = require('./reducer');
const urlParser = require('../urlParser');

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

function mapOverview(rawOverview) {
  const choicesId = getChoicesId(rawOverview.feed.link);
  const syndicationId = getSyndicationId(rawOverview.feed.link);
  const content = rawOverview.feed.entry.content['s:overview'];
  return {
    _id: choicesId,
    choicesId,
    syndicationId,
    name: content['s:name']._,
    odsCode: content['s:odsCode'],
    address: {
      addressLines: content['s:address']['s:addressLine'],
      postcode: content['s:address']['s:postcode'],
    },
    location: {
      type: 'Point',
      latitude: Number(content['s:geographicCoordinates']['s:latitude']),
      longitude: Number(content['s:geographicCoordinates']['s:longitude']),
    },
    contact: reducer.selectFields(content['s:contact'], 's', ['telephone', 'fax', 'email']),
  };
}

module.exports = mapOverview;
