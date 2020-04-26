# BD-Brewing-Revenue-Web-Application
This is a project which deals with revenue calculations for Black Donkey Brewing LTD. They are a brewing company in Srah, Co.Roscommon Ireland. It is a React Based web application used to carry out revenue calculations for a brewery. This connects to a flask backend API server which carries out requests on data and any data manipulation in the form of calculations that needs to be carried out. This then connects to MongoDB database where all data is stored for user to display and update information.
The web application focuses on the handling of the brews, inventories, stock returns and warrants. Each one of these categories has CRUD functionalities for each and their data is interconnected making for a tricky automation process. An inventory creates its data based on a brew, a stock return is based on a specified set of inventories and the warrants are based upon a stock return. All data for these are stored in a database and calculations for any data which has been updated is carried out on the server. All entries have various sorting methods i.e. sortable by month based on the categories necessities for sorting as given by the client. These data sets are all printable so that they can be sent to revenue. 

## Project Video
The Video is over the recommended 10 minutes but as the process is a complicated one to understand, the video is longer explaining the concept of the project and its inner workings. Note: video contains a small bug as seen in the stock return section not printing result for total hectolitres and duty in euros. (issue has been fixed since, was caused during video by updating one of the Sheep Stealer brews).

<a href="https://www.youtube.com/embed/veqLtWC3MEw" target="_blank"><img src="http://img.youtube.com/vi/veqLtWC3MEw/0.jpg" 
alt="Project Video" width="400" height="250" border="10" /></a>
## How to Install and Run (Locally - now not possible due to client's data protection anymore):
This area is left to show how a normal react application and flask server would need to be installed and ran on a user's PC.
#### Web Application:
-	Clone or download repository
-	Cd into bd-brewery-app folder
-	Run npm install
-	When finished installing run, npm start

#### Server
-	Cd into Server folder
-	Run command flask run

#### Web Application Accessibility
- Web application is available at: https://black-donkey-brewery.herokuapp.com/
- Note: May take a few seconds to open in the event the website has not been accessed in a while. This is due to using a free tier of Heroku. Note: Server is not accessible without authorization.

<b>Note: It is not possible to run the code without adding environmental variables files for both the web application and server. These are needed to access crucial areas of the code that must be kept private for client's data security. These involve  a .env file in the web application folder as well as a python environment variables file in the Server folder. Viewing of full application is only possible with correct credentials  as this application is in use by the company it was created for using their data which must be protected. If you wish to see full application working, view the project video at the beginning of this document.</b> 
