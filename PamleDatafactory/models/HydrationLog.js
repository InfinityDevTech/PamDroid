const Schema = require('mongoose').Schema;

const HydrationLog = new Schema({
    reciever: {type: String, required: true},
    sender: {type: String, required: true},
    amount: {type: Number, required: true},
    timestamp: {type: Date, required: true}
});

module.exports = { name: 'HydrationLog', schema: HydrationLog }
