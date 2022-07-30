process.env.DB_FILE = 'test.db';
process.env.API_PORT = 4321;

const expect = require('chai').expect

const app = require("../app");
const integration = require('mocha-axios');

const AUTH_HEADER = 'x-access-token'
const DEFAULT_PASSWORD = 'VeryStr0ngP@$$w0rd!';
const first_name = 'John';
const last_name = 'Doe';
const email = `user.${parseInt(Date.now())}@server.com`;

let token = '';
let refresh_token = '';

describe("User Services Unit Tests", () => {
	before((done) => {
		app.init().then(() => {
			done();
		});
	});

	describe("User Register", () => {

		it("Register user unsuccessfully (wrong email)", integration({
			app,
			req: {
				method: 'POST',
				url: '/register',
				data: {
					first_name: first_name,
					last_name: last_name,
					email: 'wrong',
					password: DEFAULT_PASSWORD
				}
			},
			res: {
				status: 400
			},
			after: (o) => {
				let result = o.res.data;
				expect(result.error).to.equal('EMAIL_INPUT_ERROR');
			}
		}));

		it("Register user unsuccessfully (first name error)", integration({
			app,
			req: {
				method: 'POST',
				url: '/register',
				data: {
					first_name: '',
					last_name: last_name,
					email: email,
					password: DEFAULT_PASSWORD
				}
			},
			res: {
				status: 400
			},
			after: (o) => {
				let result = o.res.data;
				expect(result.error).to.equal('FIRST_NAME_INPUT_ERROR');
			}
		}));

		it("Register user unsuccessfully (weak password)", integration({
			app,
			req: {
				method: 'POST',
				url: '/register',
				data: {
					first_name: first_name,
					last_name: last_name,
					email: email,
					password: '1234'
				}
			},
			res: {
				status: 400
			},
			after: (o) => {
				let result = o.res.data;
				expect(result.error).to.equal('PASSWORD_WEAK_ERROR');
			}
		}));

		it("Register user successfully", integration({
			app,
			req: {
				method: 'POST',
				url: '/register',
				data: {
					first_name: first_name,
					last_name: last_name,
					email: email,
					password: DEFAULT_PASSWORD
				}
			},
			res: {
				status: 201
			},
			after: (o) => {
				let result = o.res.data.result;
				expect(result.first_name).to.equal(first_name);
				expect(result.last_name).to.equal(last_name);
				expect(result.email).to.equal(email);
				expect(result.id).to.be.a('number');
				expect(result.refresh_token).to.be.a('string');
			}
		}));

		it("Register user unsuccessfully (exists)", integration({
			app,
			req: {
				method: 'POST',
				url: '/register',
				data: {
					first_name: first_name,
					last_name: last_name,
					email: email,
					password: DEFAULT_PASSWORD
				}
			},
			res: {
				status: 409
			},
			after: (o) => {
				let result = o.res.data;
				expect(result.error).to.equal('USER_EXISTS');
			}
		}));
	});

	describe("User Login", () => {
		it("Login unsuccessfull (wrong email)", integration({
			app,
			req: {
				method: 'POST',
				url: '/login',
				data: {
					email: 'wrong',
					password: DEFAULT_PASSWORD
				}
			},
			res: {
				status: 400
			},
			after: (o) => {
				let result = o.res.data;
				expect(result.error).to.equal('EMAIL_INPUT_ERROR');
			}
		}));

		it("Login unsuccessfull (no paswword)", integration({
			app,
			req: {
				method: 'POST',
				url: '/login',
				data: {
					email: email,
					password: ''
				}
			},
			res: {
				status: 400
			},
			after: (o) => {
				let result = o.res.data;
				expect(result.error).to.equal('PASSWORD_INPUT_ERROR');
			}
		}));

		it("Login unsuccessfull (wrong paswword)", integration({
			app,
			req: {
				method: 'POST',
				url: '/login',
				data: {
					email: email,
					password: '1234'
				}
			},
			res: {
				status: 400
			},
			after: (o) => {
				let result = o.res.data;
				expect(result.error).to.equal('AUTH_FAILED');
			}
		}));

		it("Login successfull", integration({
			app,
			req: {
				method: 'POST',
				url: '/login',
				data: {
					email: email,
					password: DEFAULT_PASSWORD
				}
			},
			res: {
				status: 200
			},
			after: (o) => {
				let result = o.res.data.result;
				expect(result.first_name).to.equal(first_name);
				expect(result.last_name).to.equal(last_name);
				expect(result.email).to.equal(email);
				expect(result.id).to.be.a('number');
				expect(result.refresh_token).to.be.a('string');
				expect(result.token).to.be.a('string');
				token = result.token;
				refresh_token = result.refresh_token;

				describe("Token", () => {
					it("Token unsuccessfull (no email)", integration({
						app,
						req: {
							method: 'POST',
							url: '/token',
							data: {
								refresh_token: refresh_token
							}
						},
						res: {
							status: 400
						},
						after: (o) => {
							let result = o.res.data;
							expect(result.error).to.equal('EMAIL_INPUT_ERROR');
						}
					}));

					it("Token unsuccessfull (no refresh token)", integration({
						app,
						req: {
							method: 'POST',
							url: '/token',
							data: {
								email: email,
							}
						},
						res: {
							status: 400
						},
						after: (o) => {
							let result = o.res.data;
							expect(result.error).to.equal('TOKEN_INPUT_ERROR');
						}
					}));


					it("Token unsuccessfull (wrong refresh token)", integration({
						app,
						req: {
							method: 'POST',
							url: '/token',
							data: {
								email: email,
								refresh_token: 'Wr0nG'
							}
						},
						res: {
							status: 400
						},
						after: (o) => {
							let result = o.res.data;
							expect(result.error).to.equal('AUTH_FAILED');
						}
					}));

					it("Token successfull", integration({
						app,
						req: {
							method: 'POST',
							url: '/token',
							data: {
								email: email,
								refresh_token: refresh_token
							}
						},
						res: {
							status: 200
						},
						after: (o) => {
							let result = o.res.data.result;
							expect(result.token).to.be.a('string');
							token = result.token;
						}
					}));

					describe("Rates", () => {
						it("Rates unsuccessfull (no token)", integration({
							app,
							req: {
								method: 'GET',
								url: '/rates',
							},
							res: {
								status: 403
							},
							after: (o) => {
								let result = o.res.data;
								expect(result.error).to.equal('AUTH_TOKEN_REQUIRED');
							}
						}));
	
						it("Rates unsuccessfull (wrong token)", integration({
							app,
							req: {
								method: 'GET',
								url: '/rates',
								headers: {
									[AUTH_HEADER]: 'Wr0nGt0Ken'
								},
							},
							res: {
								status: 401
							},
							after: (o) => {
								let result = o.res.data;
								expect(result.error).to.equal('AUTH_TOKEN_ERROR');
							}
						}));
	
						it("Rates successfull", integration({
							app,
							req: {
								method: 'GET',
								url: '/rates',
								headers: {
									[AUTH_HEADER]: token
								},
							},
							res: {
								status: 200
							},
							after: (o) => {
								let result = o.res.data.result;
								expect(result.currencies).to.be.a('array');
								expect(result.currencies[0]).to.be.a('string');
								expect(result.rates).to.be.a('array');
								expect(result.rates[0]).to.be.a('array');
								expect(result.rates[0][0]).equal(null);
								expect(result.rates[0][1]).to.be.a('number');
							}
						}));
					});
	

				});

			}
		}));

	});


	after((done) => {
		done();
	});
});