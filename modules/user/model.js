var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var SALT_WORK_FACTOR = 12;

var usernameValidator = [
	validate({
		message: "Username must be longer than 3 characters"
	},'len', 3, 50),
	validate({
		message: "Username can only contain alpha-numeric characters"
	},'isAlphanumeric')
];

var emailValidator = [
	validate({
		message: "Email must be longer than 6 characters"
	},'len', 6, 128),
	validate({
		message: "Email is not valid",
		passIfEmpty: true
	}, 'isEmail')
];

var passwordValidator = [
	validate({
		message: "Password must be longer than 6 characters"
	},'len', 6, 72)
];

// User schema
var User = Schema({
	username: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		validate: usernameValidator,
		index: {unique: true}
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		validate: emailValidator,
		index: {unique: true}
	},
	password: {
		type: String,
		required: true,
		validate: passwordValidator
	},
	displayName: {
		type: String,
		default: 'Nodepad User'
	}
});

// Before normalizing (lower case) the username, save the display name
/*User.path('username').set(function (value) {
	this.displayName = value;
});*/

// Password hashing on save
User.pre('save', function (next) {
	var user = this;

	// Only hash the password if it is new or has been modified
	if (!user.isModified('password')) return next();

	// Generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// Hash the password with our salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// Override the plaintext password with our hashed password
			user.password = hash;
			next();
		});
	});
});

// Compare plaintext password with hashed password
User.methods.comparePassword = function(candidatePW, callback) {
	bcrypt.compare(candidatePW, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(err, isMatch);
	});
};

module.exports = mongoose.model('User', User);