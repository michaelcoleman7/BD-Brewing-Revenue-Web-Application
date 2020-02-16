import React from 'react';
import {Navbar} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class NavBar extends React.Component {
    render() {
      return <div>
        <Navbar variant="light">
            <Navbar.Brand>
            <a href="/"><img src={require(".././Images/BlackDonkeyLogo2.png")} width="300" height="50"></img></a>
                
            </Navbar.Brand>
        </Navbar>
    </div>
    }
  }

export default NavBar;