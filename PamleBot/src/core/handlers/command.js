const fs = require('fs')
const path = require('path')
const glob = require('glob')
const {utils} = require('pamle-core')

const basePath = path.resolve(path.join(__dirname, '..'));

class commandHandler {
    constructor(pamle) {
        this.cooldowns = new Map();
		this.dmCooldowns = new Map();
        this.pamle = pamle;
  
        this.commands = new Map()

        this.cooldown = 900;
		this.dmCooldown = 10000;

        this.pamle.client.on('messageCreate', this.messageCreate.bind(this));

        this.registerCommands()
    }
    
    get commands() {
        return this._commands;
    }
    
    set commands(commands) {
        this._commands = commands;
    }
    
    clearCooldowns() {
		each([...this.cooldowns.keys()], id => {
			let time = this.cooldowns.get(id);
			if ((Date.now() - time) < this.cooldown) return;
			this.cooldowns.delete(id);
		});
		each([...this.dmCooldowns.keys()], id => {
			let time = this.dmCooldowns.get(id);
			if ((Date.now() - time) < this.dmCooldown) return;
			this.dmCooldowns.delete(id);
		});
	}

    getCommand(command) {
        return this.commands.get(command);
    }
    
    addCommand(command, handler) {
        this.commands.set(command, handler);
    }
    
    removeCommand(command) {
        this.commands.delete(command);
    }
    
    async registerCommands() {
        try {
        glob('**/*.js', {
            cwd: this.pamle.config.paths.commands,
            root: this.pamle.config.paths.commands,
            absolute: true,
        }, (err, res) => {
            res.forEach(command => {
                if (!command.endsWith('.js')) return;  
                let cmd = require(command);
                this.register(cmd);
            })
        })
    } catch (err) {
        this.pamle.logger.error(err)
    }
    }

    register(Command) {

		// create the command
		let command = new Command(this.pamle);

		// ensure command defines all required properties/methods
		command.name = command.aliases[0];

        this.pamle.logger.info(`[CommandCollection] Registering command ${command.name}`);

		if (command.aliases && command.aliases.length) {
			for (let alias of command.aliases) {
				this.commands.set(alias, command);
			}
		}
	}
    
	handleDM({ message }) {

		const cooldown = this.dmCooldowns.get(message.author.id);
		if (cooldown && (Date.now() - cooldown) < this.dmCooldown) return;
		this.dmCooldowns.set(message.author.id, Date.now());

		let msgArray = [];

		msgArray.push('**Commands are disabled in DM.**\n');
		msgArray.push('Use commands **in a server**, type **`?help`** for a list of commands.\n');
		msgArray = msgArray.concat(this.footer);

		return this.client.getDMChannel(message.author.id).then(channel => {
			if (!channel) {
				this.logger.error('Channel is undefined or null - ' + this.client.privateChannelMap[message.author.id]);
			}
			this.sendMessage(channel, { embed: { description: msgArray.join('\n') } });
		});
	}


	canExecute(command, e) {
		const { message, isAdmin, isOverseer } = e;

		let hasPermission = true;

		if (isAdmin) return true;

		if (command.isOverseer && isOverseer) {
			if (hasPermission !== true) {
				this.logOverride(message, command);
			}
			return true;
		}

		if (command.permissionsFn && command.permissionsFn({ message })) {
			return true;
		}

		return hasPermission;
	}

    shouldCooldown(message) {
		const cooldown = this.cooldowns.get(message.author.id);
		if (cooldown && (Date.now() - cooldown) <= this.cooldown) return true;
		this.cooldowns.set(message.author.id, Date.now());
		return false;
	}

    messageCreate(message) {
		if (!message.author || message.author.bot) return;

        const isAdmin = this.pamle.isAdmin(message.author)
        const isOverseer = this.pamle.isOverseer(message.author)

		const e = {message: message, isAdmin: isAdmin, isOverseer: isOverseer}
		// handle DM's
		if (!message.channel.guild) return this.handleDM(e);

		let msgContent = message.content;

		// ignore if it's not a prefixed command
		if (!msgContent.startsWith(this.pamle.config.bot.prefix)) return;

		let cmd = message.content.replace(this.pamle.config.bot.prefix, '');

		cmd = cmd.split(' ')[0].toLowerCase();
		if (!cmd.length) return;

		if (this.shouldCooldown(message)) return;

		const commands = this.commands;

		// command doesn't exist
		if (!commands.has(cmd)) return;

		const args = msgContent.replace(/ {2,}/g, ' ').split(' ').slice(1);

		// get the command
		const command = commands.get(cmd);

		// check if user has permissions
		if (!this.canExecute(command, e)) return;

        if (command.permissions == 'admin' && !isAdmin) return;
		if (command.permissions == 'overseer' && !isAdmin) return;
		
		// execute command
		try {
			command.execute(message, args)
			.catch((err) => {
                 this.pamle.logger.error(err.message)
			});
		} catch (err) {
			this.pamle.logger.error(err, {
				type: 'Command.Execute.Error',
				command: command.name,
				guild: message.channel.guild.id,
				shard: message.channel.guild.shard.id,
			});
		}
	}

}

module.exports = commandHandler