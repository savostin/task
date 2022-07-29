const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT || 8000;

app.init().then(() => {
	server.listen(port, () => {
		console.log(`API server running on port ${port}`);
	});
});