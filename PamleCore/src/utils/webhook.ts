const { Webhook } = require('simple-discord-webhooks');

class webhook {
  //@ts-ignore
  constructor(webhookURL) {
    //@ts-ignore
    this._webhook = new Webhook(webhookURL);
  }

  get webhook() {
    //@ts-ignore
    return this._webhook;
  }
//@ts-ignore
  async getMessage(messageID) {
    //@ts-ignore
    this.webhook.resolveMessageID(messageID).then(async (result) => {
      return result;
    });
  }
//@ts-ignore
  async sendMessage(message) {
    //@ts-ignore
    this.webhook.send(message).then(async (result) => {
      return result;
    });
  }
//@ts-ignore
  async editMessage(messageID, message) {
    //@ts-ignore
    this.webhook.resolveMessageID(messageID).then(async (result) => {
      //@ts-ignore
      result.edit(message).then(async (result) => {
        return result;
      });
    });
  }
//@ts-ignore
  async deleteMessage(messageID) {
    //@ts-ignore
    this.webhook.resolveMessageID(messageID).then(async (result) => {
      await result.delete();
      return true;
    });
  }
}

export default webhook;
