const fs = require('fs');
const config = require('./config');
require.extensions['.txt'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const logo = require('./logo.txt');

console.log(`\x1b[33m${logo}\x1b[0m`);
//blue terminal output
console.log(`\x1b[34mWritten By: InfinityDevTech  |  For the Pamle Discord Server\x1b[0m\n`)
//blue terminal output with the version number
console.log(`\x1b[34mVersion ${config.bot.version} Running On ${config.bot.lib}\x1b[0m\n`)

const Logger = require('./core/logger');
const pamel = require('./core/pamel');

const logger = new Logger({
  logLevel: config.sentry.logLevel || 'error',
  dsn: config.sentry.dsn,
});

const Pamel = new pamel({ logger: logger })
  Pamel.init();
