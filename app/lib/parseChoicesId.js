const pattern = new RegExp(/.*id=(\d+)/, 'i');
function parseChoicesId(url) {
  const match = pattern.exec(url);
  if (match && match.length === 2) {
    return Number(match[1]);
  }
  return undefined;
}

module.exports = parseChoicesId;
