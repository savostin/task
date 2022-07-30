# API
## Getting Started
### Navigate to the project directory and run the following commands:

##### `npm i` to set up the project
##### `npm start` to start the server
##### `npm test` to run API integration tests

API server environment variables:
* TOKEN_KEY - token encryption salt
* API_PORT or PORT - port number to which the API web server is listening
* DB_FILE - SQLite database file

The API provides the following services:
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
		* **EMAIL_INPUT_ERROR** invalid email
		* **FIRST_NAME_INPUT_ERROR** first name is empty
		* **LAST_NAME_INPUT_ERROR** last name is empty
		* **PASSWORD_INPUT_ERROR** password is empty
		* **PASSWORD_WEAK_ERROR** password is weak
		* **USER_EXISTS** there is already another user with the same email
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
		* **EMAIL_INPUT_ERROR** invalid email
		* **TOKEN_INPUT_ERROR** token is empty
		* **AUTH_FAILED** refresh token is invalid
* **Currency rates** */rates*
	* HTTP method: **GET**
	* Header required:
		* x-access-token: *access token*
	* Output:
		* **currencies** (array): list of ISO3 currency codes
		* **rates** (array of arrays, "matrix"): list of up-to-date currency rates sorted in the same order as the **currencies** array, rows to columns. Returns *null* for empty value.
	* Errors:
		* **AUTH_TOKEN_REQUIRED** access token header is empty
		* **AUTH_TOKEN_ERROR** token is invalid or expired
* **API documentation** */docs*
	* HTTP method: **GET**
	* Output: Swagger UI

Input format supported:
* JSON

Output format supported:
* JSON

All API response payloads contain the following parameters:
* API version number
* Timestamp at the time of request
* Error code (*null* for successful requests)
* Response

For testing purpose the API, uses an SQLite database. Tables will be created at launch time if needed.

The currency rates table contains all historical rates. The API returns the latest one for each pair.

**The API arichitecture does not currently conform to the CRUD paradigm due to the lack of information about the project structure and requirements. This can therefore be improved once the required information is there.**
