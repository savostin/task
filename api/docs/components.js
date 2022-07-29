module.exports = {
	components: {
		schemas: {
			User: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						description: "User identification number",
						example: 1
					},
					first_name: {
						type: 'string',
						description: "User first name",
						example: "John"
					},
					last_name: {
						type: 'string',
						description: "User last name",
						example: "Smith"
					},
					email: {
						type: 'email',
						description: "User email",
						example: "john@smith.com"
					},
					token: {
						type: "string",
						description: "User session token",
						example: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...sP5h2kVBJzodvjfrCKaj7VyzfWWtsfm3eaaDc"
					},
					refresh_token: {
						type: "string",
						description: "User refresh token",
						example: "TAKPqJgrlAmHDnycONqIBUYFvEtSjPyY1WORA...Adx2UqSjO5jiKqEHdqtTA7sUU1C4osVgL"
					}
				}
			},
			Rates: {
				type: 'object',
				properties: {
					currencies: {
						type: 'array',
						description: 'Array of currencies supported',
						items: {
							type: 'string',
							description: 'Currency ISO code',
							example: ['GBP', 'USD', 'EUR']
						}
					},
					rates: {
						type: 'array',
						description: 'Matrix of currency rates',
						items: {
							type: 'array',
							items: {
								type: 'number'
							}
						},
						example: [
							[null, Math.random() * 100, Math.random() * 100],
							[Math.random() * 100, null, Math.random() * 100],
							[Math.random() * 100, Math.random() * 100, null]
						]

					}
				}
			},
			apiResponse: {
				type: 'object',
				properties: {
					success: {
						type: 'boolean',
						description: 'The request is succeed',
						example: true
					},
					timestamp: {
						type: 'timestamp',
						description: 'The request unix timestamp',
						example: Date.now()
					},
					error: {
						type: 'string',
						description: 'Error code',
						example: null
					},
					result: {
						type: "object",
						description: 'Request result data'
					}
				}
			},
			apiResponseError: {
				type: 'object',
				properties: {
					success: {
						type: 'boolean',
						description: 'The request is succeed',
						example: false
					},
					timestamp: {
						type: 'timestamp',
						description: 'The request unix timestamp',
						example: Date.now()
					},
					error: {
						type: 'string',
						description: 'Error code',
						example: 'NOT_FOUND'
					},
					result: {
						type: "object",
						description: 'Request result data',
						example: {}
					}
				}
			}
		},
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				name: 'x-access-token',
				bearerFormat: 'JWT'
			}
		}
	}
}