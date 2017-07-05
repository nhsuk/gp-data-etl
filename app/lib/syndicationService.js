const apiRequest = require('./apiRequest');
const xmlParser = require('./xmlParser');

const DEFAULT_URL = 'http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices';
const API_KEY = process.env.SYNDICATION_API_KEY;
const SYNDICATION_HTML_PAGE_ERROR = 'Syndication XML page is returning HTML - server error';

function rejectHtml(json) {
  // in some cases if there is an error on a syndication page an HTML error page is returned
  // but with response type as 200 and a content-type of xml..
  // reject the page if the top tag is called html
  if (json.html) {
    throw new Error(SYNDICATION_HTML_PAGE_ERROR);
  }
  return json;
}

function getSubPage(syndicationId, name) {
  const url = `${DEFAULT_URL}/${syndicationId}/${name}.xml?apikey=${API_KEY}`;
  return apiRequest(url).then(xmlParser).then(rejectHtml);
}

function getPracticeSummaryPage(page) {
  const url = `${DEFAULT_URL}/all.xml?apikey=${API_KEY}&page=${page}`;
  return apiRequest(url).then(xmlParser).then(rejectHtml);
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
  DEFAULT_URL,
  SYNDICATION_HTML_PAGE_ERROR,
  getPracticeSummaryPage,
  getOverviewPage,
  getFacilitiesPage,
  getServicesPage,
};
