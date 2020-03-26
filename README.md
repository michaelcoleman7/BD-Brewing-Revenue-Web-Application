# BD-Brewing-Revenue-Web-Application
This is a project which deals with revenue calculations for Black Donkey Brewing LTD. They are a brewing company in Srah, Co.Roscommon Ireland. it is a React Based web application used to carry out revenue calculations for a brewery. This connects to a flask backend API server which carrys out requests on data and any data manipulation in the form of calculations that needs to be carried out. This then connects to MongoDB database where all data is stored for user to display and update information.

## How to Install and Run:
#### Web Application:
-	Clone or download repository
-	Cd into bd-brewery-app folder
-	Run npm install
-	When finished installing run, npm start

#### Server
-	Cd into Server folder
-	Run command flask run

<b>Note: it is not possible to run the code without adding environmental variables files for both the web application and server. These are needed to access crucial areas of the code that must be kept private for clients data security. These invlove a .env file in the web application folder as well as a python enviornment variables in the Server folder.</b> 
