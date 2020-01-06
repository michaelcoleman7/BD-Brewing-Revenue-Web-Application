import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BrewList from './Components/BrewList';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import {BrowserRouter as Router , Route, Switch} from 'react-router-dom';
import CreateBrew from './Components/CreateBrew';
import SingleBrew from './Components/SingleBrew';

function App() {
  return (
    <div className="App">
    <NavBar></NavBar>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route exact path={"/brew"} component={BrewList}/>
        <Route exact path={"/createbrew"} component={CreateBrew}/>
        <Route exact path={"/brew/:id"} component={SingleBrew}/>
      </Switch>
  </Router>

    </div>
  );
}

export default App;
