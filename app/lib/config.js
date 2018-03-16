const config = {
  containerName: process.env.CONTAINER_NAME || 'etl-output',
  hitsPerHour: 5000,
  outputDir: './output',
  outputName: 'gp-data',
  saveEvery: 100,
};

module.exports = config;
