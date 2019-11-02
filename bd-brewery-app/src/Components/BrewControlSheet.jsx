import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class CalculationSheet extends React.Component {
    render() {
      return <div>
          <h1>Brew Control Sheet</h1>
          <Link to="/" >Back</Link>
      </div>;
    }
  }

export default CalculationSheet;