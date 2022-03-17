const moment = require('moment');
const {utils} = require('pamle-core')
const { exec } = require('child_process');

require('moment-duration-format');

class Info {
	constructor(cmdOps) {

        this.pamle = cmdOps
    
	this.aliases      = ['exec'];
	this.group        = 'Admin';
	this.description  = 'Exec a shell command.';
	this.usage        = 'exec [command]';
	this.cooldown     = 60000;
	this.expectedArgs = 0;
    this.permissions  = 'admin'
	this.noDisable    = true;
	this.sendDM       = true;
	}

    exec(command) {
		return new Promise((resolve, reject) => {
			exec(command, (err, stdout, stderr) => {
				if (err) return reject(err);
				return resolve(stdout || stderr);
			});
		});
	}

	async execute(message, args) {
        let msgArray = [],
			result;

		try {
			result = await this.exec(args.join(' '));
		} catch (err) {
			result = err;
		}

		msgArray = msgArray.concat(this.utils.splitMessage(result, 1990));

		for (let m of msgArray) {
			this.sendCode(message.channel, m, 'js');
		}

		return Promise.resolve();
	}
}

module.exports = Info;