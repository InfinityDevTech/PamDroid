"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const eris = require('eris');
class Utils {
    constructor() {
        this.cleanRegex = new RegExp('([_*`])', 'g');
    }
    //@ts-ignore
    clean(str) {
        return str.replace(this.cleanRegex, '\\$&');
    }
    //@ts-ignore
    hexToInt(color) {
        return color.startsWith('#')
            ? parseInt(color.replace('#', ''), 16)
            : parseInt(color, 16);
    }
    //@ts-ignore
    regEscape(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    //@ts-ignore
    sendMessage(channel, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                options = {};
            }
            if (!channel || !message) {
                return Promise.resolve();
            }
            if (Array.isArray(message)) {
                message = message.join('\n');
            }
            message =
                typeof message === 'string'
                    ? { content: message, disableEveryone: true }
                    : message;
            message.disableEveryone =
                options.disableEveryone != undefined ? options.disableEveryone : true;
            if (options.dm) {
                const user = options.dm.user || options.dm;
                channel = yield user.getDMChannel().catch(() => false);
                if (!channel) {
                    return Promise.reject('Unable to get or create a DM with this user.');
                }
            }
            return channel
                .createMessage(message)
                //@ts-ignore
                .then((msg) => {
                this.lastMessage = Date.now();
                if (options.pin) {
                    msg.pin();
                }
                if (options.deleteAfter) {
                    setTimeout(() => {
                        msg.delete().catch(() => false);
                    }, options.deleteAfter);
                }
                return msg;
            })
                //@ts-ignore
                .catch((err) => err);
        });
    }
    splitMessage(message, len) {
        const msgArray = [];
        if (!message) {
            return [];
        }
        if (Array.isArray(message)) {
            message = message.join('\n');
        }
        if (message.length > len) {
            let str = '';
            let pos;
            while (message.length > 0) {
                let index = message.lastIndexOf('\n', len);
                if (index === -1) {
                    index = message.lastIndexOf(' ', len);
                }
                pos = (message.length >= len && index !== 0) ? index : message.length;
                // if there's no newlines
                if (pos > len) {
                    pos = len;
                }
                // grab the substring, and remove from message
                str = message.substr(0, pos);
                message = message.substr(pos);
                // push to array
                msgArray.push(str);
            }
        }
        else {
            msgArray.push(message);
        }
        return msgArray;
    }
    //@ts-ignore
    sendCode(channel, message = ' ', lang = '', options = {}) {
        let msg = `\`\`\`${lang}\n${message}\`\`\``;
        if (options.header) {
            msg = `${options.header}\n${msg}`;
        }
        if (options.footer) {
            msg = `${msg}\n${options.footer}`;
        }
        return this.sendMessage(channel, msg, options);
    }
    //@ts-ignore
    fullName(user, esc) {
        user = user.user || user;
        const discrim = user.discriminator || user.discrim;
        let username = user.username || user.name;
        if (!username) {
            return user.id;
        }
        username = this.clean(username);
        if (esc) {
            username
                .replace(/\\/g, '\\\\')
                .replace(/`/g, `\`${String.fromCharCode(8203)}`);
        }
        return `${username}#${discrim}`;
    }
}
exports.default = Utils;
exports.utils = new Utils();
