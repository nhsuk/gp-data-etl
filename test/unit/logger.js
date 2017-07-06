const logger = require('../../app/lib/utils/logger');

describe('logger smoke tests', () => {
  it('should log info', () => logger.info('info'));
  it('should log error', () => logger.error('error'));
});
