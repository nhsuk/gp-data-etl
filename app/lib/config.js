function getRule() {
  if (process.env.DISABLE_SCHEDULER === 'true') {
    return new Date(2117, 11, 31, 23, 59);
  }
  return process.env.ETL_SCHEDULE || '0 23 * * *';
}

const config = {
  hitsPerHour: 5000,
  saveEvery: 100,
  outputDir: './output',
  outputName: 'gp-data',
  containerName: process.env.CONTAINER_NAME || 'etl-output',
  getRule,
};

module.exports = config;
