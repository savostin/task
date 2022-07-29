import axios from 'axios';
import { decodeToken } from "react-jwt";


const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT || 8000;


class Api {
	_ax = axios.create({
		baseURL: `http://localhost:${port}`,
		timeout: 1000,
		contentType: "application/json",

	});
	constructor() {
		this._ax.interceptors.request.use(async (config) => {
			if (config.authReq) {
				if (await this.checkTokenAndRefresh()) {
					config.headers.common['x-access-token'] = this.token;
					return config;
				} else {
					return Promise.reject('Refresh token error');
				}
			}
			return config;
		}, (error) => {
			return Promise.reject(error);
		});

		this._ax.interceptors.response.use((response) => response.data.result, (error) => {
			if (error.response) {
				if (403 === error.response.status) {
					return this._retryRequest(error.config);
				}
				if (401 === error.response.status) {
					return this._retryRequest(error.config);
				}
				return Promise.reject(error.response.data || error.code);
			}
			return Promise.reject(error.code || error);
		});

	}

	_retryRequest(config) { // resend last request
		config._retry = true;
		return this.updateToken().then(() => {
			return this._ax(config);
		});
	}

	login(email, password) { // login user and remember e-mail, token and refresh_token
		return this._ax.post('/login', { email, password }).then(data => {
			this.token = data.token;
			this.refresh_token = data.refresh_token;
			this.email = email;
			return data;
		});
	}

	register(info) { // Not yet implemented
		return this._ax.post('/register', {})
			.then(response => {
				this.token = response.data.result.token;
				this.refresh_token = response.data.result.refresh_token;
				return response.data.result;
			});
	}

	getRates() { // get the rates
		return this._ax.get('/rates', { authReq: true })
			.then(response => {
				if (response.error === 'AUTH_FAILED') {
					this.token = null;
					this.refresh_token = null;
					return Promise.reject('AUTH_FAILED');
				}
				return response;
			});
	}

	async updateToken() { // send refresh_token to get new access token
		return this._ax
			.post('/token', { email: this.email, refresh_token: this.refresh_token })
			.catch(err => {
				if (err.error === 'AUTH_FAILED') {
					this.token = null;
					this.refresh_token = null;
					return Promise.reject('AUTH_FAILED');
				}
			})
			.then(response => {
				this.token = response.token;
				return !!response.token;
			});

	}

	// TO DO: more secure way to store tokens

	get token() {
		return localStorage.getItem("token");
	}
	set token(value) {
		return localStorage.setItem("token", value);
	}


	get email() {
		return localStorage.getItem("email");
	}

	set email(value) {
		return localStorage.setItem("email", value);
	}

	get refresh_token() {
		return localStorage.getItem("refreshToken");
	}
	set refresh_token(value) {
		return localStorage.setItem("refreshToken", value);
	}

	get isLoggedIn() { // return bool if user has a token and it's not expired
		let decoded = decodeToken(this.token);
		return decoded && decoded.exp && 1000 * decoded.exp > Date.now();
	}

	async checkTokenAndRefresh() { // check if the token expired and get a new one
		let decoded = decodeToken(this.token);
		if (decoded && decoded.exp) {
			if (1000 * decoded.exp < Date.now() + 60 * 1000) { // TO DO: 60 seconds is enough?
				return await this.updateToken();
			}
			return true;
		}
		return false;
	}
}

export default Api;