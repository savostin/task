const userLogin = require('./login');
const userRegister = require('./register');
const userToken = require('./token');

module.exports = {
	paths: {
		'/login': {
			...userLogin
		},
		'/register': {
			...userRegister
		},
		'/token': {
			...userToken
		}
	}
}