import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card'

const BreweryInformation = () => {

  const divStyle = {
    width: '30rem'
  };

  const header = {
    color: 'white'
  };

return(
    <React.Fragment> 
      <h1 style={header}>Brewery Information Management</h1>
      <div className="d-flex justify-content-around">
            <Card bg="success" style={divStyle}>          
              <Link to="/controlbreweryinfo"> <Card.Img src={require("../Images/createbreweryinfo.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Your Brewery information</Card.Title>
                <Card.Text>
                  View the current Brewery information used for warrents.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }

export default BreweryInformation;