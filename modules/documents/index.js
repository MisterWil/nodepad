Document = require("./model");

module.exports = {
	empty: function() {
		return new Document();
	},
	all: function(callback) {
		Document.find(function(err, documents) {
			callback(err, documents);
		});
	},
	get: function(id, callback) {
		Document.findById(id, function(err, document) {
			callback(err, document);
		});
	},
	create: function(data, callback) {
		var d = new Document(data);
		d.save(function(err, savedDocument) {
			callback(err, savedDocument);
		});
	},
	update: function(document, callback) {
		Document.findById(document.id, function(err, d) {
			if (err) return handleError(err);
			d.title = document.title;
			d.data = document.data;
			d.save(function(err, savedDocument) {
				callback(err, savedDocument);
			});
		});
	},
	delete: function(id, callback) {
		Document.findById(id, function (err, d) {
			if (err) return handleError(err);
			d.remove(function(err, d) {
				callback(err, d);
			});
		});
	}
};