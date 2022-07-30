# Task
## Description 
> The purposes of this exercise is to extend the functionality of the attached web app, introduce authentication, and make the Rate Checker component function as follows: when the user presses “Convert,” they should get an alert showing how much money they are converting, into which currency and at what rate.
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

# Solution

Both frontend and backend systems are developed using Node.js. They can share code base, data structures, etc. The tecnology and frameworks used in the process are marked with __bold__ font. Time spent on this coding challenge: __10 hours__.

### Future considerations and things to improve:

* Change the way the JWT token is maintained at client side. It's potentially [insecure](https://www.rdegges.com/2018/please-stop-using-local-storage/) to store it in the local storage. This is subject to the project security requirements.
* Introduce proper CRUD / RESTful API architecture combined with other API calls required for the Dashboard.
* In the backend, it makes sense to move user-related functionality to the dashboard level, as it might be required for other dashboard blocks.
* Extensive error handling. There are still some potential flows with unhandled errors.
* Deal with session expiration. Depending on project requirements, issue a warning and log user out after X minutes of inactivity.
* Introduce a registration page in the frontend and a logout routime in both backend and frontend.
* Add more unit tests.
* Optimise frontend for screens resolution less than 1200 px wide.

### More details:
* [Backend](api/)
* [Frontend](webapp/)

To launch both the API and the app, run the following:

##### `npm i` to set up the project
##### `cd ./api && npm i` to set up the API project
##### `cd ./webapp && npm i` to set up the WebApp project
##### `npm start` to start

