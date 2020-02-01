import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card'

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const Inventory = () => {

  const divStyle = {
    width: '18rem'
  };

  const header = {
    color: 'white'
  };

return(
    <React.Fragment> 
      <h1 style={header}>Inventory Management</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link to="/createinventory"> <Card.Img src={require("../Images/kegs.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create Inventory Track</Card.Title>
                <Card.Text>
                  Create a new Inventory to keep track of stock.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={divStyle}>          
              <Link to="/inventory"> <Card.Img src={require("../Images/BeerPour.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Inventorys</Card.Title>
                <Card.Text>
                  View Inventories of all Products.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }

export default Inventory;