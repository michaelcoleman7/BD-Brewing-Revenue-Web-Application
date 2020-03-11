import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

// Component to sort inventories by beer name
const InventorySeparator = () => {
    const [inventories, setinventories] = useState([]);
    const getInventories = () => {
      fetch(process.env.REACT_APP_API_URL+"api/inventory").then(res =>{
        return res.json();
      }).then(inventories => {
        console.log(inventories);
        setinventories(inventories.data);
      }).catch(err => {
        console.log(err);
      })
    }
    //call function to get inventories from api
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
  
    let inventorylist = []
    // loop over inventories and add beers by name into a list
    for (var i = 0; i < inventories.length; i++) {
        //if list doesnt already contain beer name, add name to list
        if(!inventorylist.includes(inventories[i].beer)){
          inventorylist.push(inventories[i].beer);
        }
    }

    let inventoriesArray;
    //for each beer added to list then map to a link and display to user
    if(inventorylist.length > 0){
        inventoriesArray = <div>
          {inventorylist.map(inventory => {
            return(
              <div key={inventory}>
                <Link to={"inventoryList/"+inventory}>
                  <ListGroup>
                  <center>
                      <ListGroup.Item style={listItem}>{inventory}</ListGroup.Item>
                  </center>
                  </ListGroup>
                </Link>
              </div>
            )
          })}
        </div>
    }else{
      //if list size = 0, then display no beers/inventories exist to user
      inventoriesArray = 
        <div>
          <h1 style={{color: "white"}}>No Inventories exist in the database, please create an Inventory</h1>
        </div>
    }
  
  //return list data to be displayed to user
  return(
      <React.Fragment> 
        <div>
          <h2 style={{color: "white"}}>Inventories: By Beer Name</h2>
          {inventoriesArray}
        </div>
      </React.Fragment>)
    }
//Export component for use
export default InventorySeparator;