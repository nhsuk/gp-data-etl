const chai = require('chai');
const config = require('../../app/lib/config');

const expect = chai.expect;

const disableScheduler = process.env.DISABLE_SCHEDULER;

function resetEnv() {
  process.env.disableScheduler = disableScheduler;
}

describe('config', () => {
  describe('getRule', () => {
    it('should return a date 100 years in the future when scheduler disabled', () => {
      process.env.DISABLE_SCHEDULER = 'true';
      expect(config.getRule()).to.be.a('Date');
      expect(config.getRule().getFullYear()).to.equal(2117);
    });

    it('should return a daily cron string when scheduler enabled', () => {
      process.env.DISABLE_SCHEDULER = 'false';
      expect(config.getRule()).to.equal('0 23 * * *');
    });

    afterEach(() => {
      resetEnv();
    });
  });
});
