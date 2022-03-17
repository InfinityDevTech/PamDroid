const { MessageCollector } = require('eris-message-collector');
const { utils } = require('pamle-core');
require('moment-duration-format');

class Info {
	constructor(cmdOps) {

        this.pamle = cmdOps
    
	this.aliases      = ['register', 'reg'];
	this.group        = 'Register';
	this.description  = 'Register a Pamle';
	this.usage        = 'register';
	this.cooldown     = 60000;
	this.expectedArgs = 0;
	this.noDisable    = true;
	this.sendDM       = true;
	}

    createCollector(filter, time, channel, message) {
        if (!channel) {
          channel = message.channel;
        }
        if (!time) {
          time = 60000;
        }
        if (!filter) {
          filter = (msg) => msg.author.id === message.author.id;
        }
    
        return new MessageCollector(this.pamle.client, channel, filter, { // Create our collector with our options set as the current channel, the client, filter and our time
          time: time
        });
      }

	async execute(message, args) {
    let pUser = await this.pamle.db.models.Pamle.findOne({id: message.author.id}).exec();
    
    if (pUser) {
      return utils.sendMessage(message.channel, { embed: {
        color: utils.hexToInt('#c9c9c9'),
        author: {
          name: 'PamleBot',
        },
        fields: [{name: 'ERROR!', value: 'You are already registered!'}],
        footer: {
          text: this.pamle.config.bot.footer,
        },
      } });

    } 
    const embed = {
			color: utils.hexToInt('#c9c9c9'),
			author: {
				name: 'PamleBot',
			},
			fields: [],
			footer: {
				text: this.pamle.config.bot.footer,
			},
		};

    embed.fields.push({ name: 'Register', value: `Thank you for registering! Please type your REAL NAME below, It WILL be deleted! (Type "cancel" to cancel)` });

    utils.sendMessage(message.channel, { embed });

    const collector = await this.createCollector(null, 600000, message.channel, message)

    collector.on('collect', (msg) => {
      collector.stop();
        if (msg.content.toLowerCase() === 'cancel') {
          return utils.sendMessage(message.channel, { embed: {
            color: utils.hexToInt('#c9c9c9'),
            author: {name: 'PamleBot'},
            fields: [{name: 'Register', value: 'Registration Cancelled!'}],
            footer: {text: this.pamle.config.bot.footer}
          }});
        }
        if (msg.content.length > 100) {
          return utils.sendMessage(message.channel, { embed: {
            color: utils.hexToInt('#c9c9c9'),
            author: {name: 'PamleBot'},
            fields: [{name: 'ERROR!', value: 'Either thats not a real name or its invalid!'}],
            footer: {text: this.pamle.config.bot.footer}
          }});
        }

        this.pamle.db.models.Pamle.create({username: message.author.username, discriminator: message.author.discriminator, id: message.author.id, realName: msg.content}).then(() => {

          msg.delete("Privacy Reasoning!")

        return utils.sendMessage(message.channel, { embed: {
          color: utils.hexToInt('#c9c9c9'),
          author: {name: 'PamleBot'},
          fields: [{name: 'Success!', value: `Successfully registered! Registered as ${msg.content}`}],
          footer: {text: this.pamle.config.bot.footer}
        }});

      })
	})

}
}


module.exports = Info;