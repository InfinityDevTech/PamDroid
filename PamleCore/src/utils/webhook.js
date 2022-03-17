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
    getMessage(messageID) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            this.webhook.resolveMessageID(messageID).then((result) => __awaiter(this, void 0, void 0, function* () {
                return result;
            }));
        });
    }
    //@ts-ignore
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            this.webhook.send(message).then((result) => __awaiter(this, void 0, void 0, function* () {
                return result;
            }));
        });
    }
    //@ts-ignore
    editMessage(messageID, message) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            this.webhook.resolveMessageID(messageID).then((result) => __awaiter(this, void 0, void 0, function* () {
                //@ts-ignore
                result.edit(message).then((result) => __awaiter(this, void 0, void 0, function* () {
                    return result;
                }));
            }));
        });
    }
    //@ts-ignore
    deleteMessage(messageID) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            this.webhook.resolveMessageID(messageID).then((result) => __awaiter(this, void 0, void 0, function* () {
                yield result.delete();
                return true;
            }));
        });
    }
}
exports.default = webhook;
