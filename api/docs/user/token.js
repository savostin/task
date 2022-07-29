module.exports = {
	post: {
		tags: ['token'],
		description: "User token",
		operationId: "userToken",
		parameters: [],
		requestBody: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							email: {
								type: 'string',
								description: "User email",
								example: "john@smith.com"
							},
							refresh_token: {
								type: "string",
								description: "User refresh token",
								example: "TAKPqJgrlAmHDnycONqIBUYFvEtSjPyY1WORA...Adx2UqSjO5jiKqEHdqtTA7sUU1C4osVgL"
							}
						}
					}
				}
			}
		},
		responses: {
			'200': {
				description: "New token generated successfully",
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: '#/components/schemas/apiResponse' },
							],
							properties: {
								result: {
									type: 'object',
									properties: {
										token: {
											type: 'string',
											description: 'New access token',
											example: 'TAKPqJgrlAmHDnycONqIBUYFvEtSjPyY1WORA...Adx2UqSjO5jiKqEHdqtTA7sUU1C4osVgL'
										}
									}
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
								{ $ref: '#/components/schemas/apiResponseError' }
							],
							properties: { error: { example: 'SERVER_ERROR' } }
						}
					}
				}
			},
			'400': {
				description: 'Input error',
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: '#/components/schemas/apiResponseError' }
							],
							properties: { error: { example: 'TOKEN_INPUT_ERROR' } }
						}
					}
				}
			}
		}
	}
}