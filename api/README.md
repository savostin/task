# API
## Getting Started
### In the project directory, you can run:
##### `npm i` to set up the project
##### `npm start` to start the server

API server enveironment variables:
* TOKEN_KEY - token encryption salt
* API_PORT or PORT - API webserver listening port
* DB_FILE - sqlite database file

The API provides following services:
* **User registration** */register*
	* HTTP method: **POST**
	* Input parameters:
		* First name
		* Last name
		* Email
		* Password
	* Output:
		* First name
		* Last name
		* Email
		* Session token
		* Refresh token
	* Errors:
		* **EMAIL_INPUT_ERROR** invalid e-mail
		* **FIRST_NAME_INPUT_ERROR** blank first name
		* **LAST_NAME_INPUT_ERROR** blank last name
		* **PASSWORD_INPUT_ERROR** password is empty
		* **PASSWORD_WEAK_ERROR** password is weak
		* **USER_EXISTS** there is another user with the same e-mail
* **User authentication** */login*
	* HTTP method: **POST**
	* Input parameters:
		* Email
		* Password
	* Output:
		* First name
		* Last name
		* Email
		* Session token
		* Refresh token
	* Errors:
		* **EMAIL_INPUT_ERROR** invalid e-mail
		* **PASSWORD_INPUT_ERROR** password is empty
		* **AUTH_FAILED** authentication failed
* **User JWT token refresh** */token*
	* HTTP method: **POST**
	* Input parameters:
		* Email
		* Refresh token
	* Output:
		* Session token
	* Errors:
		* **EMAIL_INPUT_ERROR** invalid e-mail
		* **TOKEN_INPUT_ERROR** token is empty
		* **AUTH_FAILED** refresh token is incorrect
* **Currency rates** */rates*
	* HTTP method: **GET**
	* Header required:
		* x-access-token: *access token*
	* Output:
		* **currencies** (array): list of ISO3 currency codes
		* **rates** (array of arrays, "matrix"): current rate for currencies in the same order as **currencies** array, rows to columns. *null* for empty value.
	* Errors:
		* **AUTH_TOKEN_REQUIRED** access token header is empty
		* **AUTH_TOKEN_ERROR** token is wrong or expired
* **API documentation** */docs*
	* HTTP method: **GET**
	* Output: Swagger UI

Input formats supported:
* JSON

Output formats supported:
* JSON

All API responses come with:
* API version
* Request timestamp
* Error code (*null* for success requests)
* Response

For testing purpose API uses SQLite database. Tables are created at the start if needed.
The currency rates table contains all historical rates. The API returns the last one for each pair.
The API arichitecture is not RESTfull due to lack of information about the project structure and requirements.