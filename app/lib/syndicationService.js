const apiRequest = require('./apiRequest');
const xmlParser = require('./xmlParser');

const DEFAULT_URL = 'http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices';
const API_KEY = process.env.SYNDICATION_API_KEY;

function getPracticeSummaryPage(page) {
  const url = `${DEFAULT_URL}/all.xml?apikey=${API_KEY}&page=${page}`;
  return apiRequest(url).then(xmlParser);
}

function getOverviewPage(syndicationId) {
  const url = `${DEFAULT_URL}/${syndicationId}/overview.xml?apikey=${API_KEY}`;
  return apiRequest(url).then(xmlParser);
}

function getFacilitiesPage(syndicationId) {
  const url = `${DEFAULT_URL}/${syndicationId}/facilities.xml?apikey=${API_KEY}`;
  return apiRequest(url).then(xmlParser);
}

module.exports = {
  getPracticeSummaryPage,
  getOverviewPage,
  getFacilitiesPage,
};
