"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const paml = __importStar(require("paml-bot"));
/**
 * Abstract class for classes that represent a command
 * @abstract Command
 * @extends Base
 */
class Command extends paml {
    constructor() {
        super(...arguments);
        this._cooldowns = new Map();
    }
    /**
     * Validate class requirements
     */
    ensureInterface() {
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
    setInternal(key, value) {
        this[key] = value;
    }
    /**
     * Execute a command
     * @param {Object} message message object
     * @param {Array} args command arguments
     * @param {String} command command name
     * @returns {Promise}
     */
    _execute(e) {
        const { message, args, command } = e;
        e.t = (key, values) => {
            return this.t(key, values);
        };
        if (e.responseChannel) {
            this.responseChannel = e.responseChannel;
        }
        this.suppressOutput = e.suppressOutput || false;
        if (this.disableDM && !message.channel.guild) {
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
                const subcommand = this.commands.find((c) => typeof c === 'object' ? c.name === args[0] : c === args[0]);
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
exports.default = Command;
