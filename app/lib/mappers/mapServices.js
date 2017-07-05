const utils = require('../utils');
const mapTitles = require('../../sources/servicesMap.json');

function getText(member) {
  return member && member.text;
}

function getUnderscore(member) {
  return member && member._;
}

function epsEnabled(eps) {
  return eps && utils.toBoolean(eps._);
}

function getCode(type) {
  return utils.getAttribute(type, 'code');
}

function getDeliverer(deliverer) {
  return deliverer && deliverer.name;
}

function mapServiceName(serviceCode, serviceTitle) {
  return mapTitles[serviceCode] || serviceTitle;
}

function mapEntryToService(entry) {
  const summary = entry.content.servicesummary;
  return {
    title: mapServiceName(getCode(summary.type), getUnderscore(summary.type)),
    code: getCode(summary.type),
    availabilityTimes: getText(summary.serviceBranchAvailabilityTimes),
    introduction: getText(summary.serviceIntroduction),
    gpReferralRequired: utils.toBoolean(getText(summary.serviceGpReferralRequired)),
    deliverer: getDeliverer(summary.serviceDeliverer),
  };
}

function getValidEntries(rawServices) {
  return utils.asArray(rawServices.feed.entry)
    .filter(entry => entry.content && entry.content.servicesummary);
}

function mapServices(rawServices) {
  return {
    epsEnabled: epsEnabled(rawServices.feed.epsIsEnabled),
    moreInformation: getUnderscore(rawServices.feed.servicesMoreInformationText),
    entries: getValidEntries(rawServices).map(mapEntryToService),
  };
}

module.exports = mapServices;
