const eris = require('eris');

export default class Utils {
  //@ts-ignore
  private lastMessage: number;
  cleanRegex = new RegExp('([_*`])', 'g');
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
public regEscape(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

//@ts-ignore
  async sendMessage(channel, message, options) {
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
      channel = await user.getDMChannel().catch(() => false);
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
  }

  public splitMessage(message: string|string[], len: number): string[] {
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
		} else {
			msgArray.push(message);
		}

		return msgArray;
	}

  //@ts-ignore
  public sendCode(channel: eris.TextableChannel, message: string = ' ', lang: string = '', options: any = {}): Promise<eris.Message> {
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

export const utils = new Utils()
