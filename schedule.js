const schedule = require('node-schedule');

const etl = require('./app/lib/etl');
const log = require('./app/lib/utils/logger');

const rule = process.env.ETL_SCHEDULE || '0 23 * * *';
const disabled = process.env.DISABLE_SCHEDULER === 'true';
if (disabled) {
  log.info('Scheduler disabled');
} else {
  log.info(`Scheduling job with rule '${rule}'`);
  schedule.scheduleJob(rule, () => {
    etl.start();
  });
}
