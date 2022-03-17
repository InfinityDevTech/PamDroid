const Schema = require('mongoose').Schema;

const Pamle = new Schema({
	username: {type: String, required: true},
	discriminator: {type: String, required: true},
	id: {type: String, required: true},
	realName: {type: String, required: true},
	bankBalance: {type: Number, required: false, default: 0},
	requtation: {type: Number, required: false, default: 0},
	stocks: {type: Map, required: false, default: new Map()},
	hydrationTokens: {type: Number, required: false, default: 0},
	debt: {type: Number, required: false, default: 0},
	inventory: {type: Map, required: false, default: new Map()}
});

module.exports = { name: 'Pamle', schema: Pamle }
