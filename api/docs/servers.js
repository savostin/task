const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT || 8000;

module.exports = {
	servers: [{
		url: `http://localhost:${port}`,
		description: "Local server"
	}, ]
}