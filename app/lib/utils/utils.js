// the XML2Json parser cannot distinguish between a single tag and what is
// usually a list of tags but happens to only have one item this makes sure
// an array is an array
function asArray(value) {
  if (value) {
    return value.constructor === Array ? value : [value];
  }
  return [];
}

function toBoolean(value) {
  return value && value.toLowerCase() === 'true';
}

function emptyObjectToUndefined(gpCounts) {
  return Object.keys(gpCounts).length > 0 ? gpCounts : undefined;
}

function getAttribute(member, field) {
  return member && member.$ && member.$[field];
}

function getBooleanAttribute(member, field) {
  return toBoolean(getAttribute(member, field));
}

module.exports = {
  asArray,
  emptyObjectToUndefined,
  getAttribute,
  getBooleanAttribute,
  toBoolean,
};
