import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { format } from 'date-fns';
import DatePicker from 'react-date-picker';

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const InventoryList = (props) => {

  const [inventories, setinventories] = useState([]);
  const [monthDate, setMonthDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("None Selected");
  const getInventories = () => {
    fetch(url+"api/inventory").then(res =>{
      return res.json();
    }).then(inventories => {
      console.log(inventories);
      setinventories(inventories.data);
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getInventories();
  }, [])

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

  let inventoryList = []
  for (var i = 0; i < inventories.length; i++) {
    var monthdateSS = inventories[i].brewDate.substring(3);
    if(monthdateSS == monthDate){
      if(inventories[i].beer == props.match.params.beer){
        inventoryList.push(inventories[i]);
      }
    }
    else if(monthDate == ""){
      if(inventories[i].beer == props.match.params.beer){
        inventoryList.push(inventories[i]);
      }
    }
  }


  let inventoriesArray;
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
    inventoriesArray = 
    <div>
      <h3 style={{color: "white"}}>No Inventories exist in the database, please create an inventory or ensure Inventory exist in month selected</h3>
    </div>
  }

  let newDate;
  const dateChange = (date) => {
          newDate = format(new Date(date), 'MM-yyyy')
          setMonthDate(newDate);
          setSelectedMonth("Current selected Month is: "+ newDate);
  }

return(
    <React.Fragment> 
      <div>
      <h5 style={{color: "white"}}>Select a Date in the month you wish to sort by: {selectedMonth}</h5>
      <DatePicker format="MM/yyyy" onChange={event => dateChange(event)}/>
      <h1 style={{color: "white"}}>Inventories List</h1>
        {inventoriesArray}
      </div>
    </React.Fragment>)
  }

export default InventoryList;