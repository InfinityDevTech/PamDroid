const path = require('path');
const getenv = require('getenv');
const pkg = require('../package.json');

const basePath = path.resolve(path.join(__dirname, '..'));

require('dotenv').config({ silent: true });

if (!global.requireReload && !global.Loader) {
  global.requireReload = require('require-reload');
  global.Promise = require('bluebird');
}

config = {
  bot: {
    InviteURL: 'https://discord.com/oauth2/authorize?client_id=951986085142089789&scope=bot&permissions=533112253943',
    token: 'OTUxOTg2MDg1MTQyMDg5Nzg5.YivcIQ.jBxe7YzGq3X_rNPfB9F-2FxJYsI',

    footer: 'PamleBot, made by InfinityDevTech!',

    //Dont forgot the PStat ALWAYS starts with "Playing: "
    pStat: 'Pamle Money Farming Simulator. | %PREFIX%help',
    prefix: ';',

    version: '0.5',
    lib: 'Eris',
    author: 'InfinityDevTech',
    authorID: 574445866220388352
  },
  paths: {
    base:        basePath,
   	commands:    path.join(basePath, '/src/commands'),
    modules:    path.join(basePath, '/src/modules'),
  },
  webhook: {
    CommandsUrl: 'https://discord.com/api/webhooks/952224332225064990/OefTY1csjKMqgRG7oHboaYPOGJgFqzyKKDU6NlnBXC79z6QDunZYNah_56SIGzwT1QXl',
    LoggingUrl: 'https://discord.com/api/webhooks/952232445326012456/b3fRRM31wtqMd7Yphdhg58HVFyuLPPKvwXMNnQxIyWUi69xPIF4_nyeZOsSPWcP3MFcY'
  },
  mongo: {
    dsn: 'mongodb+srv://pamelBot:gLNq8tocW4Byltun@cluster0.irqwx.mongodb.net/pamelBot?retryWrites=true&w=majority',
  },
  sentry: {
    logLevel: 'debug',
    dsn: 'https://061025a687364bfaaa793054c905cd9a@o1041802.ingest.sentry.io/6255077',
  }
};

module.exports = config;
