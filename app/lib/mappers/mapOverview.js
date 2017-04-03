const utils = require('../utils');
const urlParser = require('../urlParser');
const phoneNumberParser = require('../phoneNumberParser');
const mapOpeningTimes = require('./mapOpeningTimes');
const mapAddress = require('./mapAddress');
const mapLocation = require('./mapLocation');
const mapGpCounts = require('./mapGpCounts');
const mapDoctors = require('./mapDoctors');
const properCapitalize = require('../properCapitalize');

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

function getContact(content) {
  const result = { website: content.website };
  const contact = content.contact;
  if (contact) {
    result.telephone = phoneNumberParser(contact.telephone);
    result.fax = phoneNumberParser(contact.fax);
    result.email = contact.email;
  }
  return result;
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
    choicesId,
    syndicationId,
    name,
    displayName: properCapitalize(name),
    odsCode: content.odsCode,
    address: mapAddress(content.address),
    location: mapLocation(content.geographicCoordinates),
    contact: getContact(content),
    openingTimes: mapOpeningTimes.all(content.openingTimes),
    gpCounts: mapGpCounts(content.gpcounts),
    doctors: mapDoctors(content.doctors),
    acceptingNewPatients: getAcceptingNewPatients(content),
  };
}

module.exports = mapOverview;
