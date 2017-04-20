const url = require('url');

function addProtocol(website) {
  if (website) {
    return (url.parse(website).protocol)
    ? website
    : `http://${website}`;
  }
  return website;
}

module.exports = {
  addProtocol,
};
