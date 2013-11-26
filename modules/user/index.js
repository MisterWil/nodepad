User = require("./model");

module.exports = {
	isAuthenticated: function (req, res, next) {
		if (req.session.user) {
			next();
		} else {
			req.session.notifications = {
				type: 'error',
				message: 'Please Login'
			};
			res.redirect('/user');
		}
	},
	empty: function() {
		return new User();
	},
	all: function (callback) {
		User.find(function (err, users) {
			callback(err, users);
		});
	},
	get: function (id, callback) {
		User.findById(id, function (err, user) {
			callback(err, user);
		});
	},
	find: function (user, callback) {
		// TODO: Find by username OR email?
		User.findOne({username: user.username}, function (err, user) {
			callback(err, user);
		});
	},
	create: function (data, callback) {
		var u = new User(data);
		u.save(function (err, savedUser) {
			callback(err, savedUser);
		});
	},
	update: function (user, callback) {
		User.findById(user.id, function (err, u) {
			if (err) return handleError(err);
			u.username = user.username;
			u.password = user.password;
			u.email = user.email;
			u.displayName = user.displayName;
			u.save(function (err, savedUser) {
				callback(err, savedUser);
			});
		});
	},
	delete: function (id, callback) {
		User.findById(id, function (err, u) {
			if (err) return handleError(err);
			u.remove(function (err, u) {
				callback(err, u);
			});
		});
	}
};