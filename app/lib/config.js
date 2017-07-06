const config = {
  hitsPerHour: 5000,
  saveEvery: 100,
  outputDir: './output',
  outputName: 'gp-data',
  containerName: process.env.CONTAINER_NAME || 'etl-output',
};

module.exports = config;
