import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card'

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const StockReturn = () => {

  const divStyle = {
    width: '25rem'
  };

  const header = {
    color: 'white'
  };

return(
    <React.Fragment> 
      <h1 style={header}>Stock Returns</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link to="/createstockreturn"> <Card.Img src={require("../Images/stein.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create Stock Return</Card.Title>
                <Card.Text>
                  Create a new Stock return based on an existing Inventory.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={divStyle}>          
              <Link to="/stockreturn"> <Card.Img src={require("../Images/Cheers.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Stock Returns</Card.Title>
                <Card.Text>
                  View all existing Stock Returns.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }

export default StockReturn;