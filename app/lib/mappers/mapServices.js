const utils = require('../utils');

const EPS_ENABLED = 'epsIsEnabled';
const MORE_INFORMATION = 'servicesMoreInformationText';
const TEXT = 'text';
const TYPE = 'type';
const SUMMARY = 'servicesummary';
const AVAILABILITY_TIMES = 'serviceBranchAvailabilityTimes';
const INTRODUCTION = 'serviceIntroduction';
const GP_REFERRAL_REQUIRED = 'serviceGpReferralRequired';
const DELIVERER = 'serviceDeliverer';
const NAME = 'name';

function getText(member) {
  return member && member[TEXT];
}

function getUnderscore(member) {
  return member && member._;
}

function epsEnabled(eps) {
  return eps && utils.toBoolean(eps._);
}

function getCode(type) {
  return type && type.$ && type.$.code;
}

function getDeliverer(deliverer) {
  return deliverer && deliverer[NAME];
}

function mapEntryToService(entry) {
  const summary = entry.content[SUMMARY];
  return {
    title: getUnderscore(summary[TYPE]),
    code: getCode(summary[TYPE]),
    availabilityTimes: getText(summary[AVAILABILITY_TIMES]),
    introduction: getText(summary[INTRODUCTION]),
    gpReferralRequired: utils.toBoolean(getText(summary[GP_REFERRAL_REQUIRED])),
    deliverer: getDeliverer(summary[DELIVERER]),
  };
}

function getValidEntries(rawServices) {
  return utils.asArray(rawServices.feed.entry)
              .filter(entry => entry.content && entry.content[SUMMARY]);
}

function mapServices(rawServices) {
  return {
    epsEnabled: epsEnabled(rawServices.feed[EPS_ENABLED]),
    moreInformation: getUnderscore(rawServices.feed[MORE_INFORMATION]),
    entries: getValidEntries(rawServices).map(mapEntryToService),
  };
}

module.exports = mapServices;
