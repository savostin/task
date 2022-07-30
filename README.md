# Task
## Description 
> The purposes of this exercise is to extend the attached web app, add authentication and make the Rate Checker component function correctly. When the user clicks on “Convert” they should get an alert showing how much they are converting, into what and the rate.
>
> The backend needs to be built from scratch.
>
> Both frontend and backend should be delivered as git repositories. Preferable as docker container(s) with all linkage already set up.
>
> # Frontend architecture
>* Routing
>	* __React router (v6)__
>* State management
>	* __React Context__
>	* Redux
>	* Zustand
>* Token management
>	* Token should be saved securely and should be delivered to all pages using react hooks. Token should be refreshed if the expiration time is approaching.
>	* If the user visits the page on the same browser token should be refreshed and proper page should be displayed.
>* REST request
>	* __Axios__ (preferably, with interceptors for refreshing the token)
> 	* Fetch API
>* Modern react implementation using
>	* Functional components - __Hooks__
>	* __Async / Await__
>* If the user isn’t logged in the restricted pages (Wallet Dashboard) shouldn’t be accessible and the user should be redirected to the login and to the same page after successfully logged in.
>	* All input fields should be validated based on the information that needs to be filled in.
>	* Readme should contain clear instruction on how the project should be run and if there are any known issues.
>	* Comments inside the code to explain certain approach are encouraged.
>	* Screenshots with working app are encouraged.
>	* Tests are encouraged.
>
># Backend architecture
>* API Framework / Language    
>	* Preferred is Laravel/PHP but any __other language (Node.js)__ / framework can be used.
>* Database
>	* Any Relational / Non-Relational (NoSQL) / Object-oriented can be used (__SQLite__).
>* Requests documentation
>	* Any way to share a REST API documentation is accepted (__Swagger__).
>* The backend should provide authentication and random rates between the currencies available in the frontend. Available currencies information should be stored in the database.
>* Authentication should be handled fully by the API and no third party used.

# Task resolution

Both parts are developed with Node.js. Could use common code base, data structures, etc. Tecnologies and frameworks used are marked as __bold__. Time spent for the task: __10 hours__.

### Future thoughts and things to improve:

* Change the way the JWT token is kept on client side. It's potencially [insecure](https://www.rdegges.com/2018/please-stop-using-local-storage/) to store it in the local storage. Depends on the project security requirements.
* Reorganize the API architecture to proper CRUD / RESTfull combinnig with other API calls required for the Dashboard.
* On backend it's better to move the user related functions to the dashboard level as they may be needed for other blocks.
* More error handling. There are still some possible flows with unhandled errors.
* Deal with session expiration. Depending on project requirements, warn and logout user after X minutes of inactivity.
* Implement registration page on the frontend and logout routime on both.
* Add more unit tests.
* Frontend is not optimised for screens less than 1200 px wide.

### More details:
* [Backend](api/)
* [Frontend](webapp/)

To start both run
##### `npm i` to set up the project
##### `cd ./api && npm i` to set up the API project
##### `cd ./webapp && npm i` to set up the WebApp project
##### `npm start` to start

