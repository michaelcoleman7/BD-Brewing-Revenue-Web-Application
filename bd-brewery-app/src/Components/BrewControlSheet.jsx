import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class BrewControlSheet extends React.Component {
    render() {
      return <div>
          <h1>Brew Control Sheet</h1>
          <Link to="/createbrewcontrolsheet" >create a control sheet</Link>
          <Link to="/" >Back</Link>
      </div>;
    }
  }

export default BrewControlSheet;