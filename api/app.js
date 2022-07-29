require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const { passwordStrength } = require('check-password-strength');
const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');

const VERSION = require('./version');

const User = require("./model/user");
const Rates = require("./model/rates");

const token_key = process.env.TOKEN_KEY || 'RepLaceMe!';
const TOKEN_VALID_TERM = '2m';

const app = express();
app.use(cors()); // NOT FOR PRODUCTION!!!


app.use(express.json({ limit: "1mb" }));

// initialise db
app.init = async () => {
	await User.CreateSchema();
	await Rates.CreateSchema();
}

app.resp = (error, data) => {
	return {
		version: VERSION,
		success: !error,
		result: data,
		error: error,
		timestamp: Date.now()
	};
}

app.error = (error) => {
	return app.resp(error, false);
}

app.success = (data) => {
	return app.resp(false, data);
}

// register endpoint
app.post("/register", async (req, res) => {
	try {
		// Get user input
		let { first_name, last_name, email, password } = req.body;

		// Validate user input
		if (!email || !validator.validate(email)) {
			return res.status(400).json(app.error("EMAIL_INPUT_ERROR"));
		}
		if (!(first_name = first_name.trim())) {
			return res.status(400).json(app.error("FIRST_NAME_INPUT_ERROR"));
		}
		if (!(last_name = last_name.trim())) {
			return res.status(400).json(app.error("LAST_NAME_INPUT_ERROR"));
		}
		if (!password) {
			return res.status(400).json(app.error("PASSWORD_INPUT_ERROR"));
		}
		if (passwordStrength(password).id < 2) {
			return res.status(400).json(app.error("PASSWORD_WEAK_ERROR"));
		}

		// check if user already exist
		// Validate if user exist in our database
		const oldUser = await User.findOne({ email });

		if (oldUser) {
			return res.status(409).json(app.error('USER_EXISTS'));
		}

		//Encrypt user password
		encryptedPassword = await bcrypt.hash(password, 10);

		// Create user in our database
		const user = await User.create({
			first_name,
			last_name,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			password: encryptedPassword,
		});

		// Create token
		const token = jwt.sign({ user_id: user.id, email },
			token_key, {
				expiresIn: TOKEN_VALID_TERM,
			}
		);
		// save user token
		user.token = token;
		// don't send the password back!
		delete user.password;

		// return new user
		return res.status(201).json(app.success(user));
	} catch (err) {
		console.error(err);
		return res.status(500).json(app.error('SERVER_ERROR'));
	}
});

// login endpoint
app.post("/login", async (req, res) => {
	try {
		// Get user input
		const { email, password } = req.body;

		// Validate user input
		if (!email || !validator.validate(email)) {
			return res.status(400).json(app.error("EMAIL_INPUT_ERROR"));
		}
		if (!password) {
			return res.status(400).json(app.error("PASSWORD_INPUT_ERROR"));
		}

		// Validate if user exist in our database
		const user = await User.findOne({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			// Create token
			const token = jwt.sign({ user_id: user.id, email },
				token_key, {
					expiresIn: TOKEN_VALID_TERM,
				}
			);

			// save user token
			user.token = token;
			// don't send the password back!
			delete user.password;
			// user
			res.status(200).json(app.success(user));
		} else {
			res.status(400).json(app.error("AUTH_FAILED"));
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json(app.error('SERVER_ERROR'));
	}
});

// refresh token endpoint 
app.post("/token", async (req, res) => {
	try {
		// Get user input
		const { email, refresh_token } = req.body;

		// Validate user input
		if (!email || !validator.validate(email)) {
			return res.status(400).json(app.error("EMAIL_INPUT_ERROR"));
		}
		if (!refresh_token) {
			return res.status(400).json(app.error("TOKEN_INPUT_ERROR"));
		}

		// Validate if user exist in our database
		const user = await User.findOne({ refresh_token });

		if (user) {
			// Create token
			const token = jwt.sign({ user_id: user.id, email },
				token_key, {
					expiresIn: TOKEN_VALID_TERM,
				}
			);

			res.status(200).json(app.success({ token }));
		} else {
			res.status(400).json(app.error("AUTH_FAILED"));
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json(app.error('SERVER_ERROR'));
	}
});


// JWT auth middleware
const auth = (req, res, next) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		return res.status(403).json(app.error("AUTH_TOKEN_REQUIRED"));
	}
	try {
		const decoded = jwt.verify(token, token_key);
		req.user = decoded;
	} catch (err) {
		return res.status(401).json(app.error("AUTH_TOKEN_ERROR"))
	}
	return next();
};

// Get rates endpoint
app.get("/rates", auth, async (req, res) => {
	//app.get("/rates", async (req, res) => {
	const rates = await Rates.get();
	res.status(200).json(app.success(rates));
});

// swagger api endpoint
app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));


// The rest
app.use("*", (req, res) => {
	res.status(404).json(app.error('FILE_NOT_FOUND'));
});



module.exports = app;