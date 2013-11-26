//User = require("./model");

module.exports = {
	isAuthenticated: function (req, res, next) {
		if (req.session.user) {
			next();
		} else {
			req.session.messages = {errMsg: 'Login Required'};
			res.redirect('/user');
		}
	}
};