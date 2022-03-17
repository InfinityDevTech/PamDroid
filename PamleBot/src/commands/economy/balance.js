const moment = require('moment');
const {utils} = require('pamle-core');

require('moment-duration-format');

class Info {
	constructor(cmdOps) {

        this.pamle = cmdOps
    
	this.aliases      = ['balance', 'bal'];
	this.group        = 'Economy';
	this.description  = 'Get the balance of a user.';
	this.usage        = 'balance [user]';
	this.cooldown     = 60000;
	this.expectedArgs = 0;
	this.noDisable    = true;
	this.sendDM       = true;
	}

	async execute(message, args) {

		const embed = {
			color: utils.hexToInt('#c9c9c9'),
			author: {
				name: utils.fullName(message.author),
			},
			fields: [],
			footer: {
				text: this.pamle.config.bot.footer,
			},
		};

        let balance = await this.pamle.db.models.Pamle.findOne({id: message.author.id}).exec()

        if (balance) {
		   embed.fields.push({ name: 'Balance:', value: balance.bankBalance, inline: true });
        } else {
           embed.fields.push({ name: 'Error:', value: 'No account found! Did you register yet?', inline: true });
        }
		return utils.sendMessage(message.channel, { embed });
	}
}

module.exports = Info;