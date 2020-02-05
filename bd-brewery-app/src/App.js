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
import BrewSeparator from './Components/BrewSeparator';
import InventorySeparator from './Components/InventorySeparator';
import CreateStockReturn from './Components/CreateStockReturn';
import StockReturnList from './Components/StockReturnList';

function App() {
  return (
    <div className="App">
    <NavBar></NavBar>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}/>

        <Route exact path={"/brewlist/:beer"} component={BrewList}/>
        <Route exact path={"/brewlist/:beer"} component={BrewSeparator}/>
        <Route exact path={"/createbrew"} component={CreateBrew}/>
        <Route exact path={"/brew/:id"} component={SingleBrew}/>
        <Route exact path={"/brew"} component={BrewSeparator}/>

        <Route exact path={"/createinventory"} component={CreateInventory}/>
        <Route exact path={"/inventorylist/:beer"} component={InventoryList}/>
        <Route exact path={"/inventorylist/"} component={InventorySeparator}/>
        <Route exact path={"/inventory"} component={InventorySeparator}/>
        <Route exact path={"/inventory/:id"} component={SingleInventory}/>

        <Route exact path={"/createstockreturn"} component={CreateStockReturn}/>
        <Route exact path={"/stockreturnlist"} component={StockReturnList}/>
      </Switch>
  </Router>

    </div>
  );
}

export default App;
