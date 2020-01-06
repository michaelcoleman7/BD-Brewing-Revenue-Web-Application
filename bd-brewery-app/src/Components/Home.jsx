import React from 'react';
import '../App.css';
import Brew from './Brew';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class Home extends React.Component {
    render() {
      return <div>
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="Home">
            <Brew/>
          </Tab>
        </Tabs>
    </div>
    }
  }

export default Home;