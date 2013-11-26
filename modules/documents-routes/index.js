var documents = require("../documents");
var user = require("../user");

var express = require("express");
var app = module.exports = express();

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;
});

// Document list
app.get('/documents.:format?', user.isAuthenticated, function (req, res) {
	documents.all(function(err, docs) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send(docs);

	    		break;

	    	default:
	    		res.render('documents/index.jade', {
	    			documents: docs
	    		});
		}
	});
});

// Edit document
app.get('/documents/:id.:format?/edit', user.isAuthenticated, function (req, res) {
	documents.get(req.params.id, function (err, d) {
		if (err) return next(err);
    	res.render('documents/edit.jade', {
    		document: d
    	});
	});
});

// Delete document over get command
app.get('/documents/:id.:format?/del', user.isAuthenticated, function (req, res) {
	documents.delete(req.params.id, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send('true');
	    		break;

	    	default:
	    		req.session.notifications = {
	    			type: 'success',
	    			message: 'Document Deleted'
	    		};
	    		res.redirect('/documents');
		}
	})
});

// New document
app.get('/documents/new', user.isAuthenticated, function (req, res) {
	res.render('documents/new.jade', { document: documents.empty() });
});

// Create new document
app.post('/documents.:format?', user.isAuthenticated, function (req, res, next) {
	documents.create(req.body.document, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send(document);
	    		break;

	    	default:
	    		req.session.notifications = {
	    			type: 'success',
	    			message: 'Document Created'
	    		};
	    		res.redirect('/documents');
		}
	});
});

// Read document
app.get('/documents/:id.:format?', user.isAuthenticated, function(req, res) {
	documents.get(req.params.id, function (err, d) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send(d);

	    		break;

	    	default:
	    		res.render('documents/show.jade', {
	    			document: d
	    		});
		}
	});
});

// Update document
app.put('/documents:id.:format?', user.isAuthenticated, function (req, res) {
	documents.update(req.body.document, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send(document);
				break;

			default:
				req.session.notifications = {
	    			type: 'success',
	    			message: 'Document Updated'
	    		};
				res.redirect('/documents');
		}
	});
});

// Delete document
app.del('/documents/:id.:format?', user.isAuthenticated, function (req, res) {
	documents.delete(req.params.id, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send('true');
	    		break;

	    	default:
	    		req.session.notifications = {
	    			type: 'success',
	    			message: 'Document Deleted'
	    		};
	    		res.redirect('/documents');
		}
	})
});