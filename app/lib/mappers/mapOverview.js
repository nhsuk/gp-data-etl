const reducer = require('./reducer');
const urlParser = require('../urlParser');

function matchAltHref(link) {
  return link.$ && link.$.rel === 'alternate';
}

function getChoicesId(links) {
  const href = links.find(matchAltHref);
  return href ? urlParser.getChoicesId(href.$.href) : undefined;
}

function mapOverview(rawOverview) {
  const choicesId = getChoicesId(rawOverview.feed.link);
  if (choicesId === undefined) {
    throw new Error(`No Choices ID found for ${rawOverview.feed.id}`);
  }
  const syndicationId = urlParser.getSyndicationId(rawOverview.feed.id);
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
