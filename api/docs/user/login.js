module.exports = {
	post: {
		tags: ['login'],
		description: "User login",
		operationId: "userLogin",
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
							password: {
								type: "string",
								description: "User password",
								example: "VeryStr0ngP@$$w0rd!"
							}
						}
					}
				}
			}
		},
		responses: {
			'200': {
				description: "User logged in successfully",
				content: {
					'application/json': {
						schema: {
							allOf: [
								{ $ref: '#/components/schemas/apiResponse' },
							],
							properties: {
								result: {
									$ref: '#/components/schemas/User'
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
							properties: { error: { example: 'EMAIL_INPUT_ERROR' } }
						}
					}
				}
			}
		}
	}
}