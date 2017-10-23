const config = {
  app: {
    name: 'gp-data-etl',
  },
  hitsPerHour: 5000,
  saveEvery: 100,
  outputDir: './output',
  outputName: 'gp-data',
  containerName: process.env.CONTAINER_NAME || 'etl-output',
};

module.exports = config;
