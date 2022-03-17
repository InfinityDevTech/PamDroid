const moment = require('moment');
const {utils} = require('pamle-core')

require('moment-duration-format');

class Info {
	constructor(cmdOps) {

        this.pamle = cmdOps
    
	this.aliases      = ['info'];
	this.group        = 'Info';
	this.description  = 'Get bot info.';
	this.usage        = 'info';
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

		embed.fields.push({ name: 'Version', value: this.pamle.config.bot.version, inline: true });
		embed.fields.push({ name: 'Library', value: this.pamle.config.bot.lib, inline: true });
		embed.fields.push({ name: 'Creator', value: this.pamle.config.bot.author, inline: true });
		embed.fields.push({ name: 'Invite', value: `[Invite Me!](${this.pamle.config.bot.InviteURL})`, inline: true });
        embed.fields.push({ name: 'Uptime', value: `${uptime.format('d')} days, ${uptime.format('h')} hours, ${uptime.format('m')} minutes, ${uptime.format('s')} seconds.`, inline: true });
        embed.fields.push({ name: 'Weezer', value: 'yes.', inline: true });
		return utils.sendMessage(message.channel, { embed });
	}
}

module.exports = Info;