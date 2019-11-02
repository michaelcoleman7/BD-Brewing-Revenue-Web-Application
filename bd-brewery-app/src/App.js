import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BrewControlSheet from './Components/BrewControlSheet';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import {BrowserRouter as Router , Route, Switch, Link} from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <NavBar></NavBar>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path={"/brewcontrolsheet"} component={BrewControlSheet}/>
      </Switch>
  </Router>

    </div>
  );
}

export default App;
