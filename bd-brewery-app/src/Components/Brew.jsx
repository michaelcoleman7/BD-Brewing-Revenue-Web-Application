import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card'

const Brew = () => {

  const divStyle = {
    width: '18rem'
  };

  const header = {
    color: 'white'
  };

return(
    <React.Fragment> 
      <h1 style={header}>Brew Management</h1>
      <div className="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link to="/createbrew"> <Card.Img src={require("../Images/Background3.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create Brew</Card.Title>
                <Card.Text>
                  Create a new brew containing all necessary information needed.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={divStyle}>          
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