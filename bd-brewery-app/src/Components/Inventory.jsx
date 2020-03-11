import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';

//Component to display inventory options to user
const Inventory = () => {
return(
    <React.Fragment> 
      <h1 style={{color: 'white'}}>Inventory Management</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={{width: '28rem'}}>          
              <Link to="/createinventory"> <Card.Img src={require("../Images/barrels.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title className="custom-card">Create Inventory Track</Card.Title>
                <Card.Text className="custom-card-text">
                  Create a new Inventory to keep track of stock.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={{width: '28rem'}}>          
              <Link to="/inventory"> <Card.Img src={require("../Images/viewinv.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title className="custom-card">View Inventorys</Card.Title>
                <Card.Text className="custom-card-text">
                  View Inventories of all Products.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }
//Export component for use
export default Inventory;