import React from 'react';
import {Navbar} from 'react-bootstrap'

class NavBar extends React.Component {
    render() {
      return <div>
        <Navbar bg="light" variant="light">
            <Navbar.Brand>
                <img alt="" src={require(".././Images/BlackDonkeyLogo.png")} width="300" height="50"/>
            </Navbar.Brand>
        </Navbar>
    </div>
    }
  }

export default NavBar;