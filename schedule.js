const schedule = require('node-schedule');
const config = require('./app/lib/config');
const etl = require('./app/lib/etl');
const log = require('./app/lib/utils/logger');

log.info(`Scheduling job with rule '${config.getRule()}'`);
schedule.scheduleJob(config.getRule(), () => {
  etl.start();
});
