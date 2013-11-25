var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Document schema
var Document = Schema({
	title: String,
	data: String,
	date:  {type: Date, default: Date.now },
	meta: {
		tags: String,
		votes: {type: Number, default: 0},
		favs: {type: Number, default: 0}
	}
});

module.exports = mongoose.model('Document', Document);