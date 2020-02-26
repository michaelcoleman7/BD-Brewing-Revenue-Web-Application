import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card'

const BreweryInformation = () => {

  const divStyle = {
    width: '25rem'
  };

  const header = {
    color: 'white'
  };

return(
    <React.Fragment> 
      <h1 style={header}>Brewery Information Management</h1>
      <div className="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link to="/createbreweryinfo"> <Card.Img src={require("../Images/createbreweryinfo.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create Brewery information</Card.Title>
                <Card.Text>
                  Create Brewery information for warrents.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={divStyle}>          
              <Link to="/breweryinfo"> <Card.Img src={require("../Images/viewbreweryinfo.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Brewery information</Card.Title>
                <Card.Text>
                  View the current Brewery information for warrents.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }

export default BreweryInformation;