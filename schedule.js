const schedule = require('node-schedule');
const scheduleConfig = require('./app/lib/scheduleConfig');
const etl = require('./app/lib/etl');
const log = require('./app/lib/utils/logger');

log.info(`Scheduling job with rule '${scheduleConfig.getSchedule()}'`);
schedule.scheduleJob(scheduleConfig.getSchedule(), () => {
  etl.start();
});
