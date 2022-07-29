const ratesGet = require('./get');

module.exports = {
	paths: {
		'/rates': {
			...ratesGet
		}
	}
}