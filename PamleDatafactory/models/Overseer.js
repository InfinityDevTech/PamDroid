const Schema = require('mongoose').Schema;

const Overseer = new Schema({
	username: {type: String, required: true},
	discriminator: {type: String, required: true},
	id: {type: String, required: true},
	reason: {type: String, required: false}
});

module.exports = { name: 'Overseer', schema: Overseer }
