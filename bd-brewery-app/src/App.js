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
import StockReturnList from './Components/StockReturnList';
import SingleStockReturn from './Components/SingleStockReturn';

function App() {
  return (
    <div className="App">
    <NavBar></NavBar>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}/>

        <Route exact path={"/brewlist/:beer"} component={BrewList}/>
        <Route exact path={"/createbrew"} component={CreateBrew}/>
        <Route exact path={"/brew/:id"} component={SingleBrew}/>
        <Route exact path={"/brew"} component={BrewSeparator}/>

        <Route exact path={"/createinventory"} component={CreateInventory}/>
        <Route exact path={"/inventorylist/:beer"} component={InventoryList}/>
        <Route exact path={"/inventory"} component={InventorySeparator}/>
        <Route exact path={"/inventory/:id"} component={SingleInventory}/>

        <Route exact path={"/stockreturnlist"} component={StockReturnList}/>
        <Route exact path={"/stockreturn/:id"} component={SingleStockReturn}/>

        <Route path="*" exact component={() => <h1>404 NOT FOUND</h1>}/>
      </Switch>
  </Router>

    </div>
  );
}

export default App;
