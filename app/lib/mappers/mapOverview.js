const mapAddress = require('./mapAddress');
const mapContact = require('./mapContact');
const mapDoctors = require('./mapDoctors');
const mapGpCounts = require('./mapGpCounts');
const mapLocation = require('./mapLocation');
const mapOpeningTimes = require('./mapOpeningTimes');
const properCapitalize = require('../properCapitalize');
const urlParser = require('../urlParser');
const utils = require('../utils/utils');

function matchAltHref(link) {
  return utils.getAttribute(link, 'rel') === 'alternate';
}

function getChoicesId(links) {
  const link = links.find(matchAltHref);
  return link ? urlParser.getChoicesId(utils.getAttribute(link, 'href')) : undefined;
}

function getAcceptingNewPatients(content) {
  return utils.getBooleanAttribute(content.newPatients, 'accepting');
}

function mapOverview(rawOverview) {
  const choicesId = getChoicesId(rawOverview.feed.link);
  if (!choicesId) {
    throw new Error(`No Choices ID found for ${rawOverview.feed.id}`);
  }

  const syndicationId = urlParser.getSyndicationId(rawOverview.feed.id);
  const content = rawOverview.feed.entry.content.overview;

  const name = content.name && content.name._;
  if (!name) {
    throw new Error(`No Name found for ${rawOverview.feed.id}`);
  }

  return {
    _id: choicesId,
    acceptingNewPatients: getAcceptingNewPatients(content),
    address: mapAddress(content.address),
    choicesId,
    contact: mapContact(content.contact, content.website),
    displayName: properCapitalize(name),
    doctors: mapDoctors(content.doctors),
    gpCounts: mapGpCounts(content.gpcounts),
    location: mapLocation(content.geographicCoordinates),
    name,
    odsCode: content.odsCode,
    openingTimes: mapOpeningTimes.all(content.openingTimes),
    syndicationId,
  };
}

module.exports = mapOverview;
