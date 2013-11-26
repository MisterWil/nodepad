var user = require("../user");

var express = require("express");
var app = module.exports = express();

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;
});

// User login
app.get('/user', function (req, res) {
	res.render('user/login.jade');
});

// Process login request
app.post('/user', function (req, res) {
	user.find(req.body.user, function (err, foundUser) {
		if (err || !foundUser) {
			req.session.notifications = {
				type: 'error',
				message: 'Username or password incorrect'
			};
			res.redirect('/user');
			return;
		}

		foundUser.comparePassword(req.body.user.password, function (err, isMatch) {
			if (err || !isMatch) {
				req.session.notifications = {
					type: 'error',
					message: 'Username or password incorrect'
				};
				res.redirect('/user');
				return;
			}

			req.session.user = foundUser;
			res.redirect('/');
		});
	});
})

// Process logout request
app.get('/user/logout', function (req, res) {
	if (req.session.user) {
		req.session.user = null;
		req.session.notifications = {
			type: 'success',
			message: 'Logged Out'
		};
	}

	res.redirect('/user');
});

//User registration
app.get('/user/new', function (req, res) {
	res.render('user/new.jade');
});

// New user
app.post('/user/new', function (req, res) {
	var userBody = req.body.user;

	if (userBody.password != userBody.pwVerify) {
		req.session.notifications = {
			type: 'error',
			message: 'Passwords do not match'
		};
		res.redirect('/user/new');
		return;
	}

	user.create(userBody, function(err, user) {
		if (err || !user) {
			err = processError(err);
			req.session.notifications = {
	    			type: 'error',
	    			message: err
	    		};
			res.redirect('/user/new');
			return;
		}

		req.session.notifications = {
			type: 'success',
			message: 'Registration successful. Please login...'
		};
		res.redirect('/user');
	});
});

function processError(err) {
	console.log(err);
	var errorString;
	if (err) {
		if (err.name == 'MongoError') {
			// Duplicate Key Error
			if (err.code == 11000) {
				if (err.indexOf('username') != -1) {
					errorString = 'Username is already taken';
				} else if (err.indexOf('email') != -1) {
					errorString = 'Given email address is already registered';
				}
			}
		} else if (err.name == 'ValidationError') {
			errorString = [];
			for (var key in err.errors) {
				errorString.push(err.errors[key].message);
			}
		}
	} else {
		errorString = 'Database Error - Unable to save new user';
	}

	return errorString;
}

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