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
import WarrentDisplay from './Components/WarrentDisplay';
import CreateBreweryInformation from './Components/CreateBreweryInformation';
import Login from './Components/Login';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

function App() {
  return (
    <div className="App">
    <NavBar></NavBar>
    <Router>
      {/*Security details linked to okta application protecting access*/}
      <Security
         issuer="https://dev-895663.okta.com"
         client_id="0oa2a32mkLlJLDjuW4x6"
         redirect_uri={'http://localhost:3000/implicit/callback'}
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

        <SecureRoute  exact path={"/warrentdisplay"} component={WarrentDisplay}/>

        <SecureRoute  exact path={"/createbreweryinfo"} component={CreateBreweryInformation}/>

        <SecureRoute path="*" exact component={() => <h1>404 NOT FOUND</h1>}/>
      </Switch>
      </Security>
  </Router>

    </div>
  );
}

export default App;
