import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';

// Component to display list of brews sorted by beer's batch numbers
const BrewList = (props) => {
  const [brews, setbrews] = useState([]);
  const [monthDate, setMonthDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("None Selected");
  const getBrews = () => {
    //fetch api data from server using enviornment variable
    fetch(process.env.REACT_APP_API_URL+"api/brew").then(res =>{
      return res.json();
    }).then(brews => {
      //set brews array
      setbrews(brews.data);
    }).catch(err => {
      console.log(err);
    })
  }

  // get brews from api call by calling getBrews()
  useEffect(() => {
    getBrews();
  }, [])

  //css for list item
  const listItem = {
    width: '18rem',
    width: '40%',
    color: 'white',
    marginTop: '10px',
    fontFamily: 'Cursive',
    fontSize: '20px',
    borderStyle: 'solid',
    borderColor: 'brown',
    background: 'rgba(144, 84, 23, 0.5)'
  };

  let beerlist = []
  // loop over brews and add each brew of selected beer type
  for (var i = 0; i < brews.length; i++) {
    var monthdateSS = brews[i].brewDate.substring(3);
    // Allow user to sort brews by specific month
    if(monthDate == monthdateSS){
      // if brew array beer is equal to beer in passed in url (props)
      if(brews[i].beer == props.match.params.beer){
        // Add brew to list
        beerlist.push(brews[i]);
      }
    }
    //Add all brews to list
    else if(monthDate==""){
      // if brew array beer is equal to beer in passed in url (props)
      if(brews[i].beer == props.match.params.beer){
        // Add brew to list
        beerlist.push(brews[i]);
      }
    }
  }
  
  let brewsArray;
  let counter = 0;
  // For each batch number in list map to an individual link and display to user
  if(beerlist.length > 0){
      brewsArray = <div>
        {beerlist.map(brew => {
          return(
            <div key={counter}>
              <Link to={"../brew/"+brew._id}>
                <ListGroup>
                <center>
                    <ListGroup.Item style={listItem}>{brew.batchNo}</ListGroup.Item>
                </center>
                </ListGroup>
              </Link>
            </div>
          )
          counter++;
        })}
      </div>
  }else{
    // if length is 0, then display that brews dont exist
    brewsArray = 
    <div>
      <h3 style={{color: "white"}}>No Brews exist  for this beer in the database, please create a brew of this beer type or check if beer in month exists</h3>
    </div>
  }

  let newDate;
  //Set up date for user selected dates
  const dateChange = (date) => {
    newDate = format(new Date(date), 'MM-yyyy')
    setMonthDate(newDate);
    setSelectedMonth("Current selected Month is: "+ newDate);
  }

//Return react fragment to display to user
return(
    <React.Fragment> 
      <div>
      <h5 style={{color: "white"}}>Select a Date in the month you wish to sort by: {selectedMonth}</h5>
      <DatePicker format="MM/yyyy" onChange={event => dateChange(event)}/>
      <h2 style={{color: "white"}}>Brew: {props.match.params.beer} - Batch Numbers</h2>
        {brewsArray}
      </div>
    </React.Fragment>)
  }
// Export component for use
export default BrewList;