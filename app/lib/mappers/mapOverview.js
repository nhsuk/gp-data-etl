const urlParser = require('../urlParser');
const phoneNumberParser = require('../phoneNumberParser');
const mapOpeningTimes = require('./mapOpeningTimes');
const mapAddress = require('./mapAddress');
const mapLocation = require('./mapLocation');
const mapGpCounts = require('./mapGpCounts');
const mapDoctors = require('./mapDoctors');
const properCapitalize = require('../properCapitalize');

const OVERVIEW = 's:overview';
const NAME = 's:name';
const ODS_CODE = 's:odsCode';
const ADDRESS = 's:address';
const COORDINATES = 's:geographicCoordinates';
const CONTACT = 's:contact';
const OPENING_TIMES = 's:openingTimes';
const GP_COUNTS = 's:gpcounts';
const DOCTORS = 's:doctors';
const TELEPHONE = 's:telephone';
const FAX = 's:fax';
const EMAIL = 's:email';
const WEBSITE = 's:website';

function matchAltHref(link) {
  return link.$ && link.$.rel === 'alternate';
}

function getChoicesId(links) {
  const href = links.find(matchAltHref);
  return href ? urlParser.getChoicesId(href.$.href) : undefined;
}

function getContact(content) {
  const result = { website: content[WEBSITE] };
  const contact = content[CONTACT];
  if (contact) {
    result.telephone = phoneNumberParser(contact[TELEPHONE]);
    result.fax = phoneNumberParser(contact[FAX]);
    result.email = contact[EMAIL];
  }
  return result;
}

function mapOverview(rawOverview) {
  const choicesId = getChoicesId(rawOverview.feed.link);
  if (!choicesId) {
    throw new Error(`No Choices ID found for ${rawOverview.feed.id}`);
  }

  const syndicationId = urlParser.getSyndicationId(rawOverview.feed.id);
  const content = rawOverview.feed.entry.content[OVERVIEW];

  const name = content[NAME] && content[NAME]._;
  if (!name) {
    throw new Error(`No Name found for ${rawOverview.feed.id}`);
  }

  return {
    _id: choicesId,
    choicesId,
    syndicationId,
    name,
    displayName: properCapitalize(name),
    odsCode: content[ODS_CODE],
    address: mapAddress(content[ADDRESS]),
    location: mapLocation(content[COORDINATES]),
    contact: getContact(content),
    openingTimes: mapOpeningTimes.all(content[OPENING_TIMES]),
    gpCounts: mapGpCounts(content[GP_COUNTS]),
    doctors: mapDoctors(content[DOCTORS]),
  };
}

module.exports = mapOverview;
