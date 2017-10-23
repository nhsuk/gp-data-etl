const config = require('../config');
module.exports = require('nhsuk-bunyan-logger')(config.app.name);
