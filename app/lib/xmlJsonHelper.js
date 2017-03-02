// the XML2Json parser cannot distinguish between a single tag and what is
// usually a list of tags but happens to only have one item this makes sure
// an array is an array
function asArray(value) {
  if (value) {
    return value.constructor === Array ? value : [value];
  }
  return [];
}

module.exports = {
  asArray,
};
