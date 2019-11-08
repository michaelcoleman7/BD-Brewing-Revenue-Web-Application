import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Brew from './Components/Brew';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import {BrowserRouter as Router , Route, Switch, Link} from 'react-router-dom';
import CreateBrew from './Components/CreateBrew';

function App() {
  return (
    <div className="App">
    <NavBar></NavBar>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path={"/brew"} component={Brew}/>
        <Route path={"/createbrew"} component={CreateBrew}/>
      </Switch>
  </Router>

    </div>
  );
}

export default App;
