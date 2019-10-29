import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactBootstrap, {Navbar, Image} from 'react-bootstrap'

function App() {
  return (
    <div className="App">
      <Navbar bg="light" variant="light">
        <Navbar.Brand>
          <img src={require("./Images/BlackDonkeyLogo.png")} width="300" height="50"/>
        </Navbar.Brand>
      </Navbar>

    </div>
  );
}

export default App;
