
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var stylus = require('stylus');
var nib = require('nib');

// Database setup
var db = mongoose.connect('mongodb://localhost/nodepad');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
};

var sessionStore = new MongoStore({
	url: 'mongodb://localhost/nodepad',
	clear_interval: 3600
});

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(stylus.middleware({
		src: __dirname + '/public',
		compile: compile
	  }
	));
	app.use(express.favicon());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "aSecretGoesHere",
		cookie: { maxAge: 24 * 60 * 60 * 1000 },
		store: sessionStore
	}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;
});

app.configure('production', function() {
  app.use(express.logger());
  app.use(express.errorHandler());
  //db = mongoose.connect('mongodb://localhost/nodepad-production');
});

// Routes
//app.get('/', routes.index);
//app.get('/users', user.list);

app.get('/', function(req, res) {
  res.redirect('/documents')
});

app.all('/*', function (req, res, next) {
	res.locals.notifications = req.session.notifications;
	delete req.session.notifications;
	next();
});

app.use('/', require('./modules/users-api'));
app.use('/', require('./modules/documents-api'));

// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
