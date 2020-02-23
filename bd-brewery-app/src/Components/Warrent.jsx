import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card'

const Warrent = () => {

  const divStyle = {
    width: '25rem'
  };

  const header = {
    color: 'white'
  };

return(
    <React.Fragment> 
      <h1 style={header}>Warrent Management</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link to="/createwarrent"> <Card.Img src={require("../Images/Background1.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create a Warrent</Card.Title>
                <Card.Text>
                  Create a new warrent to be sent to revenue.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={divStyle}>          
              <Link to="/warrent"> <Card.Img src={require("../Images/BlackDonkeyBeers3.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Warrents</Card.Title>
                <Card.Text>
                  View existing warrents.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }

export default Warrent;