import * as eris from 'eris';
//@ts-ignore
import * as paml from 'paml-bot'

interface Command {
	commands?: string[];
	cooldown?: number;
	defaultCommand?: string;
	disableDM?: boolean;
	[key: string]: any;
}

interface CommandData {
        message: eris.Message;
        args?: any[];
        t?: Function;
        command?: string;
        isAdmin?: boolean;
        isOverseer?: boolean;
        suppressOutput?: boolean;
        responseChannel?: eris.TextChannel;
}

interface SubCommand {
	name: string;
	desc: string;
	usage: string;
	default?: boolean;
	cooldown?: number;
}

/**
 * Abstract class for classes that represent a command
 * @abstract Command
 * @extends Base
 */
abstract class Command extends paml {
    //@ts-ignore
	public name: string;
	public abstract aliases: string[];
	public abstract description: string;
	public abstract usage: string|string[];
	public abstract example: string|string[];
	public abstract expectedArgs: number;

	private _cooldowns: Map<string, any> = new Map();

    //@ts-ignore
	public abstract execute(e): Promise<any>;

	/**
	 * Validate class requirements
	 */
	public ensureInterface() {
		// required properties
		if (this.aliases == undefined) {
			throw new Error(`${this.constructor.name} command must define aliases property.`);
		}
		if (this.description == undefined) {
			throw new Error(`${this.constructor.name} command must define description property.`);
		}
		if (this.usage == undefined) {
			throw new Error(`${this.constructor.name} command must define usage property.`);
		}

		// required methods
		if (this.execute == undefined) {
			throw new Error(`${this.constructor.name} command must have an execute method.`);
		}

		// warnings
		if (this.expectedArgs == undefined) {
			this.logger.warn(`${this.constructor.name} should defined the expectedArgs property.`);
		}
		this.expectedArgs = this.expectedArgs || 0;
	}

	/**
	 * Set internal property
	 */
	public setInternal(key: string, value: any) {
		this[key] = value;
    }

	/**
	 * Execute a command
	 * @param {Object} message message object
	 * @param {Array} args command arguments
	 * @param {String} command command name
	 * @returns {Promise}
	 */
	public _execute(e: CommandData): Promise<any> {
		const { message, args, command } = e;

		e.t = (key: string, values: any[]) => {
			return this.t( key, values);
		};

		if (e.responseChannel) {
			this.responseChannel = e.responseChannel;
		}

		this.suppressOutput = e.suppressOutput || false;

		if (this.disableDM && !(<eris.GuildChannel>message.channel).guild) {
			return this.sendMessage(message.channel, `This command doesn't work in DM`);
		}
//@ts-ignore
		if ((this.expectedArgs && args.length < this.expectedArgs) || (args && args[0] === 'help')) {
			if (this.permissions === 'admin' && (!e.isAdmin || !e.isOverseer)) {
				return Promise.resolve();
			}
			return this.help(message);
		}

		if (!e.isAdmin && !e.isOverseer) {
			const cooldown = this.shouldCooldown(message);
			if (cooldown) {
				return cooldown.suppress ? Promise.reject(null) :
					this.sendMessage(message.channel, `${message.author.mention}, a little too quick there.`, { deleteAfter: 9000 })
						.then(() => {
							cooldown.suppress = true;
						});
			}
		}

		if (!this.commands) {
			return this.execute(e).then(() => {
				if (!this._cooldowns.has(message.author.id)) {
					this._cooldowns.set(message.author.id, { time: Date.now() });
				}
			});
		}

		return this.execute(e).then(() => {
			if (this.commands) {
                //@ts-ignore
				const subcommand = this.commands.find((c: SubCommand) => typeof c === 'object' ? c.name === args[0] : c === args[0]);
				if (subcommand) {
                        //@ts-ignore
					if (args[1] && args[1] === 'help') {
						return this.help(message, subcommand);
					}
                     //@ts-ignore
					return this[args[0]]({ message, args: args.slice(1), guildConfig, t: e.t }).then(() => {
						if (!this._cooldowns.has(message.author.id)) {
							this._cooldowns.set(message.author.id, { time: Date.now() });
						}
					});
				}
			}

			if (this.defaultCommand) {

				return this[this.defaultCommand]({ message, args, t: e.t }).then(() => {
					if (!this._cooldowns.has(message.author.id)) {
						this._cooldowns.set(message.author.id, { time: Date.now() });
					}
				});
			}
		});
	}
}

export default Command;