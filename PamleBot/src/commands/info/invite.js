const moment = require('moment');
const {utils} = require('pamle-core')

require('moment-duration-format');

class Info {
	constructor(cmdOps) {

        this.pamle = cmdOps
    
	this.aliases      = ['invite'];
	this.group        = 'Info';
	this.description  = 'Get bot Invite Code.';
	this.usage        = 'invite';
	this.cooldown     = 60000;
	this.expectedArgs = 0;
	this.noDisable    = true;
	this.sendDM       = true;
	}

	async execute(message, args) {

		const uptime = moment.duration(process.uptime(), 'seconds');

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
		embed.fields.push({ name: 'Invite', value: `[Invite URL!](${this.pamle.config.bot.InviteURL})` });
		return utils.sendMessage(message.channel, { embed });
	}
}

module.exports = Info;