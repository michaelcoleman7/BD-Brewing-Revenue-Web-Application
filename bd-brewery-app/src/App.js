import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactBootstrap, {Navbar, Button} from 'react-bootstrap';
import CalculationSheet from './Components/CalculationSheet';

function App() {
  return (
    <div className="App">
      <Navbar bg="light" variant="light">
        <Navbar.Brand>
          <img src={require("./Images/BlackDonkeyLogo.png")} width="300" height="50"/>
        </Navbar.Brand>
      </Navbar>

      <CalculationSheet name={"Brew Control Sheet"}></CalculationSheet>

      



    </div>
  );
}

export default App;
