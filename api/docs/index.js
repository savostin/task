const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const user = require('./user');
const rates = require('./rates');

module.exports = {
	...basicInfo,
	...servers,
	...components,
	...tags,
	paths: { ...rates.paths, ...user.paths }
};