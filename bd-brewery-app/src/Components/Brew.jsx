import React from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';

// Brew component to display user options for brews
const Brew = () => {
return(
    <React.Fragment> 
      <h1 style={{color: "white"}}>Brew Management</h1>
      <div className="d-flex justify-content-around">
            <Card bg="primary" style={{width: '18rem'}}>          
              <Link to="/createbrew"> <Card.Img src={require("../Images/Background3.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title className="custom-card">Create Brew</Card.Title>
                <Card.Text className="custom-card-text">
                  Create a new brew containing all necessary information needed.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="success" style={{width: '18rem'}}>          
              <Link to="/brew"> <Card.Img src={require("../Images/createbeer.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title className="custom-card">View Brews</Card.Title>
                <Card.Text className="custom-card-text">
                  View a list of all the brews in the database.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
    </React.Fragment>)
  }
// export component for use
export default Brew;