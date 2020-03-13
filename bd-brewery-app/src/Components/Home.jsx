import React from 'react';
import '../App.css';
import Brew from './Brew';
import Inventory from './Inventory';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import StockReturn from './StockReturn';
import Warrant from './Warrant';
import BreweryInformation from './BreweryInformation';
import { withAuth } from '@okta/okta-react';

//Component to display all tab options to user
class Home extends React.Component {
  
 async componentDidMount() {
    const accessToken = await this.props.auth.getAccessToken();
    localStorage.setItem('jwt-token', accessToken);
  }
    render() {
      return <div>
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="custom-nav-bg">
          <Tab eventKey="Brew" title="Brew Managment">
            <Brew/>
          </Tab>
          <Tab eventKey="Inventory" title="Inventory Managment">
            <Inventory/>
          </Tab>
          <Tab eventKey="StockReturn" title="Stock Returns">
            <StockReturn/>
          </Tab>
          <Tab eventKey="Warrant" title="Warrant Management">
            <Warrant/>
          </Tab>
          <Tab eventKey="BreweryInformation" title="Brewery Information">
            <BreweryInformation/>
          </Tab>
        </Tabs>
    </div>
    }
  }
//export component for use
export default (withAuth(Home));