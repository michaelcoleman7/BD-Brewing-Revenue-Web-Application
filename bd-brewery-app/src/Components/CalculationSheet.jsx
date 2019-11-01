import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactBootstrap, {Button} from 'react-bootstrap'

class CalculationSheet extends React.Component {
    render() {
      return <Button onClick={ButtonClick()}>{this.props.name}</Button>;
    }
  }

export default CalculationSheet;