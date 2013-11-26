var users = require("../users");

var express = require("express");
var app = module.exports = express();

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;
});

// User login
app.get('/user', function(req, res) {
	res.render('users/login.jade');
});

/*
// Edit document
app.get('/documents/:id.:format?/edit', function (req, res) {
	documents.get(req.params.id, function (err, d) {
		if (err) return next(err);
    	res.render('documents/edit.jade', {
    		document: d
    	});
	});
});

// Delete document over get command
app.get('/documents/:id.:format?/del', function (req, res) {
	documents.delete(req.params.id, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send('true');
	    		break;

	    	default:
	    		res.redirect('/documents');
		}
	})
});

// New document
app.get('/documents/new', function(req, res) {
	res.render('documents/new.jade', { document: documents.empty() });
});

// Create new document
app.post('/documents.:format?', function(req, res, next) {
	documents.create(req.body.document, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send(document);
	    		break;

	    	default:
	    		res.redirect('/documents');
		}
	});
});

// Read document
app.get('/documents/:id.:format?', function(req, res) {
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
app.put('/documents:id.:format?', function (req, res) {
	documents.update(req.body.document, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send(document);
				break;

			default:
				res.redirect('/documents');
		}
	});
});

// Delete document
app.del('/documents/:id.:format?', function (req, res) {
	documents.delete(req.params.id, function(err, document) {
		if (err) return next(err);
		switch(req.params.format) {
			case 'json':
				res.send('true');
	    		break;

	    	default:
	    		res.redirect('/documents');
		}
	})
});*/