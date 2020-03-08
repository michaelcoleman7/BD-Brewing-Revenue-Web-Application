import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';

//component to show brew information options
const BreweryInformation = () => {
return(
    <React.Fragment> 
      <h1 style={{color: "white"}}>Brewery Information Management</h1>
      <div className="d-flex justify-content-around">
            <Card bg="success" style={{width: '30rem'}}>          
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

  //export component for use
export default BreweryInformation;