import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import createImage from '../Images/Background3.jpg';

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const Brew = () => {

  const divStyle = {
    width: '18rem'
  };

  const divStyle2 = {
    width: '18rem'
  };

  const header = {
    color: 'white'
  };

return(
    <React.Fragment> 
      <h1 style={header}>Brew Management</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link to="/createbrew"> <Card.Img src={require("../Images/Background3.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create Brew</Card.Title>
                <Card.Text>
                  Create a new brew containing all necessary information needed.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={divStyle2}>          
              <Link to="/brew"> <Card.Img src={require("../Images/createbeer.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Brews</Card.Title>
                <Card.Text>
                  View a list of all the brews in the database.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }

export default Brew;