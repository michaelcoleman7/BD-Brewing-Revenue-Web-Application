import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const InventorySeparator = () => {

    const [inventories, setinventories] = useState([]);
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
  
  
    let inventorylist = []
    for (var i = 0; i < inventories.length; i++) {
        console.log(inventories[i].beer)
        if(inventorylist.includes(inventories[i].beer)){
            //console.log("Duplicate found: "+brews[i].beer);
        }
        else{
            inventorylist.push(inventories[i].beer);
        }
    }
    let inventoriesArray;
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
        inventoriesArray = 
      <div>
        <h1 style={{color: "white"}}>No Inventories exist in the database, please create an Inventory</h1>
      </div>
    }
  
  return(
      <React.Fragment> 
        <div>
          <h1 style={{color: "white"}}>Inventory: Beers</h1>
          {inventoriesArray}
        </div>
      </React.Fragment>)
    }

export default InventorySeparator;