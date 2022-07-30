# WebApp
## Getting Started
### In the project directory, run the following commands:
##### `npm i` to set up the project
##### `npm start` to start the server

## Login window
If user is not authenticated, a login page will come up. For testing purposes, use the following credentials:

username: `some@thing.com`

password: `VeryStr0ngP@$$w0rd!`

![Login window](screens/login.png?raw=true "Login window")

The fields will be validated and all invalid values will be highlighted with a red border around the respective form control.
After logging in, a dashboard appears. The purpose of the task is to make the **Rate Checker** widget work correctly.

![Rate Checker](screens/RateChecker.png?raw=true "Rate Checker block")

The component retrieves the list of available currencies and their rates from the API. It then keeps refreshing the data every 30 seconds. When the user enters some amount into one of the two form fields, the widget calculates the value in the other field based on the current rate. Both values are updated when the new rate is received.

User can switch between currencies by pressing the **↑↓** button.

The identical currency on the opposite side will be disabled:

![Rate Checker disabled](screens/disabled.png?raw=true "Rate Checker disabled option")

In the background, a token refresh routine receives a new access token by supplying the refresh token saved in the local storage once the previous one is about to expire (2 minutes for testing purposes).
