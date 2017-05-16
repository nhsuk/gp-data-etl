const utils = require('../utils');

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

function mapServiceName(serviceTitle) {
  const mapTitles = {
    'Intrapartum care (care to women in labour)': 'Care for women in labour',
    'Vascular testing (D-dimer and Dopler)': 'Blood circulation tests (D-dimer and Doppler test)',
    'Ear, nose and throat (ENT) specialist clinic': 'Ear, nose and throat clinic',
    Vasectomy: 'Vasectomy (sterilisation for men)',
    Acupuncture: 'Acupuncture',
    'Dietician - provided in house and available on NHS': 'Diet specialist',
    'Dermatology specialist clinic': 'Dermatology (specialist skin clinic)',
    'Hormonal injections/implants': 'Hormone injections and implants',
    'Pharmacy available on-site': 'Pharmacy',
    'Urgent care centre': 'Urgent care walk-in centre',
    'Smoking cessation clinic': 'Help with stopping smoking',
    'Long-acting reversible contraception (LARC- eg IUD or implant)': 'Contraceptive injections, implants and coils',
    'Travel health with yellow fever': 'Travel vaccinations (including yellow fever)',
    'Asthma clinic': 'Asthma clinic',
    'Eye test - available on NHS': 'Eye test',
    'Anticoagulant monitoring and dosing - provided in-house': 'Monitoring blood-thinning medication',
    'Chiropody - provided in house and available on NHS': 'Foot specialist',
    Phlebotomy: 'Blood tests',
    'Minor injuries unit': 'Minor injuries walk-in clinic',
    'Child health and development': 'Child health and development',
    'Minor surgery (e.g. removal of moles and skin lesions)': 'Minor surgery (for example removing moles)',
    'Learning disability health check': 'Health checks for people with learning disabilities',
    'Stop smoking services': 'Help with stopping smoking',
    'Primary care counselling service': 'Counselling',
    'Diabetes clinic providing insulation initiation': 'Diabetes clinic',
    'Travel health without yellow fever': 'Travel vaccinations (not including yellow fever)',
    'Child immunisations': 'Child vaccinations',
    'Minor injuries': 'Minor injuries walk-in centre',
    'Drug and alcohol services': 'Drug and alcohol services',
    'Young person\'s clinic': 'Clinic for young people',
    'Obesity management clinic': 'Obesity management clinic',
    'Baby clinic with health visitor': 'Baby clinic with health visitor',
    Physiotherapy: 'Physiotherapy',
    'Laser/cosmetic services - not available on NHS': 'Laser and cosmetic services (not available on the NHS)',
    'Non-NHS sports injury clinic': 'Sports injury clinic (not available on the NHS)',
    'Joint injections': 'Joint injections',
    'COPD clinic with spirometry': 'Clinic for chronic obstructive pulmonary disease (COPD)',
    'Dressings clinic (nurse led)': 'Help with changing dressings',
    'Walk-in centre': 'Walk-in centre',
  };
  const re = new RegExp(Object.keys(mapTitles).join('|'), 'gi');
  // eslint-disable-next-line no-param-reassign
  serviceTitle = serviceTitle.replace(re, matched => mapTitles[matched]);

  return serviceTitle;
}

function mapEntryToService(entry) {
  const summary = entry.content.servicesummary;
  return {
    title: mapServiceName(getUnderscore(summary.type)),
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
