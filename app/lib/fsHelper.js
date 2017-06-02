const fs = require('fs');
const log = require('./logger');
const config = require('./config');

const OUTPUT_DIR = config.outputDir;

function fileExists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (ex) {
    return false;
  }
}

function createDirIfMissing(path) {
  if (!fileExists(path)) {
    fs.mkdirSync(path);
  }
}

function saveJsonSync(obj, filename) {
  createDirIfMissing(OUTPUT_DIR);
  const json = JSON.stringify(obj);
  fs.writeFileSync(`${OUTPUT_DIR}/${filename}.json`, json, 'utf8');
  log.info(`${filename} saved`);
}

function loadJsonSync(filename) {
  const path = `${OUTPUT_DIR}/${filename}.json`;
  const jsonString = fileExists(path) ? fs.readFileSync(path, 'utf8') : undefined;
  return jsonString ? JSON.parse(jsonString) : undefined;
}

module.exports = {
  saveJsonSync,
  loadJsonSync,
};
