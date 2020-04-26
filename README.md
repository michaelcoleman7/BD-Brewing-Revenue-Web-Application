# BD-Brewing-Revenue-Web-Application
This is a project which deals with revenue calculations for Black Donkey Brewing LTD. They are a brewing company in Srah, Co.Roscommon Ireland. it is a React Based web application used to carry out revenue calculations for a brewery. This connects to a flask backend API server which carrys out requests on data and any data manipulation in the form of calculations that needs to be carried out. This then connects to MongoDB database where all data is stored for user to display and update information.

## Project Video
The Video is over the recommended 10 minutes but as the process is a complicated one to understand, the video is longer explaining the concept of the project and its inner workings.

<a href="https://www.youtube.com/embed/veqLtWC3MEw" target="_blank"><img src="http://img.youtube.com/vi/veqLtWC3MEw/0.jpg" 
alt="Project Video" width="400" height="250" border="10" /></a>
## How to Install and Run (Locally - not possible due to clients data protection anymore):
#### Web Application:
-	Clone or download repository
-	Cd into bd-brewery-app folder
-	Run npm install
-	When finished installing run, npm start

#### Server
-	Cd into Server folder
-	Run command flask run

#### Web Application Accessability
- Web application is available at: https://black-donkey-brewery.herokuapp.com/
- Note: May take a few seconds to open in the event the website has not been accessed in a while. This is due to using a free tier of heroku. Note: Server is not accessable without authorization.

<b>Note: it is not possible to run the code without adding environmental variables files for both the web application and server. These are needed to access crucial areas of the code that must be kept private for clients data security. These invlove a .env file in the web application folder as well as a python enviornment variables file in the Server folder. Viewing of full application is only possible with correct credientials as this application is in use by the company it was created for using their data which must be protected. If you wish to see full application working, view the project video at the beginning of this document</b> 
