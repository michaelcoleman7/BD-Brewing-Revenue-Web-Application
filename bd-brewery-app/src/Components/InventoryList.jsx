import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { format } from 'date-fns';
import DatePicker from 'react-date-picker';

//component which lists all the inventories by batch number
const InventoryList = (props) => {
  const [inventories, setinventories] = useState([]);
  const [monthDate, setMonthDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("None Selected");

  // Function to get inventories from api
  const getInventories = () => {
    //fetch inventories data from api
    fetch(process.env.REACT_APP_API_URL+"api/inventory").then(res =>{
      return res.json();
    }).then(inventories => {
      //set inventories returned to array
      setinventories(inventories.data);
    }).catch(err => {
      console.log(err);
    })
  }
  useEffect(() => {
    getInventories();
  }, [])

  //css for each list item
  const listItem = {
    width: '18rem',
    width: '40%',
    color: 'white',
    marginTop: '10px',
    fontFamily: 'Artifika',
    fontSize: '20px',
    borderStyle: 'solid',
    borderColor: 'brown',
    background: 'rgba(144, 84, 23, 0.5)'
  };

  //
  let inventoryList = []
   // loop over inventories and add each inventory of selected beer type
  for (var i = 0; i < inventories.length; i++) {
    var monthdateSS = inventories[i].brewDate.substring(3);
     // Allow user to sort inventories by specific month - if user selected month = inventories brew creation month
    if(monthdateSS == monthDate){
      // if inventory array beer is equal to beer in passed in url (props)
      if(inventories[i].beer == props.match.params.beer){
        // Add inventory to list
        inventoryList.push(inventories[i]);
      }
    }
    //if no month selected - then dispaly all inventories
    else if(monthDate == ""){
      if(inventories[i].beer == props.match.params.beer){
        // Add inventory to list
        inventoryList.push(inventories[i]);
      }
    }
  }


  let inventoriesArray;
  // For each inventory in list map to an individual link and display to user
  if(inventoryList.length > 0){
      inventoriesArray = <div>
        {inventoryList.map(inventory => {
          return(
            <div key={inventory._id}>
              <Link to={"../inventory/"+inventory._id}>
                <ListGroup>
                <center>
                    <ListGroup.Item style={listItem}>{inventory.batchNo}</ListGroup.Item>
                </center>
                </ListGroup>
              </Link>
            </div>
          )
        })}
      </div>
  }else{
    // if no inevntories in list, display to user
    inventoriesArray = 
    <div>
      <h3 style={{color: "lightgrey", fontFamily: "FFF_Tusj"}}>No Inventories exist in the database, please create an inventory or ensure Inventory exists in month selected</h3>
    </div>
  }

  let newDate;
  // change date based on user selection
  const dateChange = (date) => {
    newDate = format(new Date(date), 'MM-yyyy')
    setMonthDate(newDate);
    setSelectedMonth("Current selected Month is: "+ newDate);
  }

// return list display to user
return(
    <React.Fragment> 
      <div>
      <h5 style={{color: "white"}}>Select a Date in the month you wish to sort by: {selectedMonth}</h5>
      <DatePicker format="MM/yyyy" onChange={event => dateChange(event)}/>
      <h2 style={{color: "white"}}>Inventories List</h2>
        {inventoriesArray}
      </div>
    </React.Fragment>)
  }
//export component for use
export default InventoryList;