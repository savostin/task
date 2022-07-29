module.exports = {
	get: {
		tags: ['rates'],
		description: "Get rates for currencies",
		operationId: "ratesGet",
		parameters: [],
		security: { bearerAuth: [] },
		responses: {
			'200': {
				description: "Currency rates",
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: '#/components/schemas/apiResponse' },
							],
							properties: {
								result: {
									$ref: '#/components/schemas/Rates'
								}
							}
						}
					}
				},
			},
			'500': {
				description: 'Server error',
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: '#/components/schemas/apiResponseError' },
							],
							properties: { error: { example: 'SERVER_ERROR' } }
						}
					}
				}
			},
			'403': {
				description: 'Auth token required',
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: '#/components/schemas/apiResponseError' }
							],
							properties: { error: { example: 'AUTH_TOKEN_REQUIRED' } }
						}
					}
				}
			},
			'401': {
				description: 'Auth token is not valid',
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: '#/components/schemas/apiResponseError' }
							],
							properties: { error: { example: 'AUTH_TOKEN_ERROR' } }
						}
					}
				}
			}
		}
	}
}