# WebApp
## Getting Started
### In the project directory, you can run:
##### `npm i` to set up the project
##### `npm start` to start the server

## Login window
If user has not authenticated yet a login page appears. For testing purpose use 
username: `some@thing.com`
password: `VeryStr0ngP@$$w0rd!`
![Login window](screens/login.png?raw=true "Login window")
The fields are validated marking wrong values with red border.
After logging in a dashboard appears. The purpose of the task is to make **Rate Checker** block working correctly.
![Rate Checker](screens/RateChecker.png?raw=true "Rate Checker block")
The component retreives from the API the list of currencies available and their rates. Then refresh the data every 30 seconds. When user enters amount value to one of 2 fields it updates another one with a value calculated on the current rate. All values are updated when the new rate is received.

User can switch currencies by clicking **↑↓** button.

The same currency on the opposite side is disabled:
![Rate Checker disabled](screens/disabled.png?raw=true "Rate Checker disabled option")
As a background task a refresh token routine receives a new access token based on refresh token saved in local storage when the old one is about to expire (2 minutes for testing purpose).