import React, { Component } from 'react';
import CalculationSheet from './CalculationSheet';

class Home extends React.Component {
    render() {
      return <div>
        <CalculationSheet name={"Brew Control Sheet"}></CalculationSheet>
    </div>
    }
  }

export default Home;