const apiRequest = require('./apiRequest');
const xmlParser = require('./xmlParser');

const DEFAULT_URL = 'http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices';
const API_KEY = process.env.SYNDICATION_API_KEY;

function getSubPage(syndicationId, name) {
  const url = `${DEFAULT_URL}/${syndicationId}/${name}.xml?apikey=${API_KEY}`;
  return apiRequest(url).then(xmlParser);
}

function getPracticeSummaryPage(page) {
  const url = `${DEFAULT_URL}/all.xml?apikey=${API_KEY}&page=${page}`;
  return apiRequest(url).then(xmlParser);
}

function getOverviewPage(syndicationId) {
  return getSubPage(syndicationId, 'overview');
}

function getFacilitiesPage(syndicationId) {
  return getSubPage(syndicationId, 'facilities');
}

function getServicesPage(syndicationId) {
  return getSubPage(syndicationId, 'services');
}

module.exports = {
  getPracticeSummaryPage,
  getOverviewPage,
  getFacilitiesPage,
  getServicesPage,
};
