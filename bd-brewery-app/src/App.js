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
import WarrantDisplay from './Components/WarrantDisplay';
import ControlBreweryInformation from './Components/ControlBreweryInformation';
import Login from './Components/Login';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

function App() {
  return (
    <div className="App">
    <NavBar></NavBar>
    <Router>
      {/*Security details linked to okta application protecting access*/}
      <Security
         issuer={process.env.REACT_APP_OKTA_ISSUER}
         client_id={process.env.REACT_APP_OKTA_CLIENT_ID}
         redirect_uri={process.env.REACT_APP_OKTA_REDIRECT_URL}
         scope={['openid', 'profile', 'email']}>
      <Switch>
        <Route path="/" exact component={Login}/>
        <Route path="/implicit/callback" component={ImplicitCallback} />

        {/*Secure Route allows for routes  to be protected unless the user is signed into okta account linked to application*/}
        <SecureRoute  exact path={"/home"} component={Home}/>
        <SecureRoute  exact path={"/brewlist/:beer"} component={BrewList}/>
        <SecureRoute  exact path={"/createbrew"} component={CreateBrew}/>
        <SecureRoute  exact path={"/brew/:id"} component={SingleBrew}/>
        <SecureRoute  exact path={"/brew"} component={BrewSeparator}/>

        <SecureRoute  exact path={"/createinventory"} component={CreateInventory}/>
        <SecureRoute  exact path={"/inventorylist/:beer"} component={InventoryList}/>
        <SecureRoute  exact path={"/inventory"} component={InventorySeparator}/>
        <SecureRoute  exact path={"/inventory/:id"} component={SingleInventory}/>

        <SecureRoute  exact path={"/stockreturnlist"} component={StockReturnList}/>
        <SecureRoute  exact path={"/stockreturn/:id"} component={SingleStockReturn}/>

        <SecureRoute  exact path={"/Warrantdisplay"} component={WarrantDisplay}/>

        <SecureRoute  exact path={"/controlbreweryinfo"} component={ControlBreweryInformation}/>

        <SecureRoute path="*" exact component={() => <h1 style={{color : "white"}}>404 NOT FOUND</h1>}/>
      </Switch>
      </Security>
  </Router>

    </div>
  );
}

export default App;
