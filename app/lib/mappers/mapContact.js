const phoneNumberParser = require('../phoneNumberParser');
const addProtocol = require('../utils/urlUtils').addProtocol;

function mapContact(rawContact, website) {
  const result = { website: addProtocol(website) };
  const contact = rawContact;
  if (contact) {
    result.telephone = phoneNumberParser(contact.telephone);
    result.fax = phoneNumberParser(contact.fax);
    result.email = contact.email;
  }
  return result;
}

module.exports = mapContact;
