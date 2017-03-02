const fs = require('fs');
const log = require('./logger');

function saveJson(obj, filename) {
  const json = JSON.stringify(obj);
  fs.writeFileSync(`${filename}.json`, json, 'utf8');
  log.info(`${filename} saved`);
}

function loadJson(path) {
  const jsonString = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : undefined;
  return jsonString ? JSON.parse(jsonString) : undefined;
}

module.exports = {
  saveJson,
  loadJson,
};
