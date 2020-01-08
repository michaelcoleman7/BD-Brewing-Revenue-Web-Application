import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BrewList from './Components/BrewList';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import {BrowserRouter as Router , Route, Switch} from 'react-router-dom';
import CreateBrew from './Components/CreateBrew';
import SingleBrew from './Components/SingleBrew';
import CreateInventory from './Components/CreateInventory';
import InventoryList from './Components/InventoryList';
import SingleInventory from './Components/SingleInventory';

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

        <Route exact path={"/createinventory"} component={CreateInventory}/>
        <Route exact path={"/inventory"} component={InventoryList}/>
        <Route exact path={"/inventory/:id"} component={SingleInventory}/>
      </Switch>
  </Router>

    </div>
  );
}

export default App;
