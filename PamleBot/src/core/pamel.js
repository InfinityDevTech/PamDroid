const config = require('./../config');
const db = require('./db');
const logger = require('./logger');
const getenv = require('getenv');
const Eris = require('eris');
const {Utils, Webhook} = require('pamle-core')
const commandHandler = require('./handlers/command');
const each = require('async-each');

class pamel {
  constructor(startOps) {
    this.startTime = Date.now();
    this.isReady = false;

    this._logger = startOps.logger || new logger({
      logLevel: config.sentry.logLevel,
      dsn: config.sentry.dsn,
    });

    this.loggingWebhook = new Webhook(config.bot.LoggingUrl)
    this.commandsWebhook = new Webhook(config.bot.CommandsUrl)
  }
  
  get utils() {
    return Utils;
  }

  get client() {
    return this._client;
  }

  get logger() {
    return this._logger
  }

  get db() {
    return db;
  }

  get models() {
    return db.models;
  }

  get config() {
    return config
  }

  async isAdmin(user) {
    let admin = await this.db.models.Admin.findOne({id: user.id}).exec()
  
    if (admin) {
      return true
    } else {
      return false
    }
  }
  
  async isOverseer(user) {
    let admin = await this.db.models.Overseer.findOne({id: user.id}).exec()
  
    if (admin) {
      return true
    } else {
      return false
    }
  }

  init() {
    const token = config.bot.token;

    this._client = new Eris(token);

    this.client.once('ready', this.ready.bind(this))

    this.client.on('error', (err) => {
      if (err == '') return;
      this.logger.error(err.message)
    });
    this.client.on('warn', (err) => {
      if (err == '') return;
      const embed = {
        color: this.pamle.utils.hexToInt('#c9c9c9'),
        author: {
          name: 'PamleBot Error Reporting',
        },
        fields: [],
        footer: {
          text: this.pamle.config.bot.footer,
        },
      };
  
      embed.fields.push({name: 'Error:', value: err});
  
        this.loggingWebhook.sendMessage(embed)
  
      this.logger.warn(err.message)
    });
    this.client.on('debug', (msg) => {
      if (typeof msg === 'string') {
        msg = msg.replace(config.bot.token, '[TOKEN]');
      }
      this.logger.debug(`[Eris] ${msg}`);
    });

    this.commandHandler = new commandHandler(this)

    this.login();
  }

  login() {
    this.client.connect();

    return true;
  }

  ready() {
    this.logger.info(`[PAMLE] : Bot is ready with ${this.client.guilds.size} guilds.`);

    this.isReady = true;

    if (config.bot.pStat) {
      this.status = config.bot.pStat.replace('%PREFIX%', config.bot.prefix);
      this.client.editStatus('online', { name: this.status });
    }
  }
}

module.exports = pamel;
