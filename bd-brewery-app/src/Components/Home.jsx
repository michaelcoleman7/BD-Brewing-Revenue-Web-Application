import React from 'react';
import '../App.css';
import Brew from './Brew';
import Inventory from './Inventory';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class Home extends React.Component {
    render() {
      return <div>
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="Brew" title="Brew Managment">
            <Brew/>
          </Tab>
          <Tab eventKey="Inventory" title="Inventory Managment">
            <Inventory/>
          </Tab>
        </Tabs>
    </div>
    }
  }

export default Home;