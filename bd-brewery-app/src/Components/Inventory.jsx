import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';

//Component to display inventory options to user
const Inventory = () => {
return(
    <React.Fragment> 
      <h1 style={{color: 'white'}}>Inventory Management</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={{width: '18rem'}}>          
              <Link to="/createinventory"> <Card.Img src={require("../Images/kegs.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create Inventory Track</Card.Title>
                <Card.Text>
                  Create a new Inventory to keep track of stock.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={{color: 'white'}}>          
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
//Export component for use
export default Inventory;