const moment = require('moment');

const azureService = require('./utils/azureService');
const config = require('./config');
const log = require('./utils/logger');

const outputFile = `${config.outputDir}/${config.outputName}.json`;

function getDateYYYYMMDD(date) {
  return moment(date).format('YYYYMMDD');
}

function getPrefix() {
  // prevent dev from over-writing production azure blob
  return process.env.NODE_ENV === 'production' ? '' : 'dev-';
}

function getTimeStampedName() {
  const name = `${config.outputName}-${getDateYYYYMMDD(new Date())}.json`;
  return `${getPrefix()}${name}`;
}

async function uploadOutputToAzure() {
  const name = `${getPrefix()}${config.outputName}.json`;
  log.info(`Overwriting '${name}' in Azure`);
  await azureService.uploadToAzure(config.containerName, outputFile, name);

  const timeStampedName = getTimeStampedName();
  log.info(`Saving date stamped version '${timeStampedName}' in Azure`);
  return azureService.uploadToAzure(config.containerName, outputFile, timeStampedName);
}

module.exports = uploadOutputToAzure;
