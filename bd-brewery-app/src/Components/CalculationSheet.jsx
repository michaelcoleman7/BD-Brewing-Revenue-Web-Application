import React, { Component } from 'react';
import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom';

class CalculationSheet extends React.Component {
    render() {
      return <Button><Link to="/brewcontrolsheet" style={{ textDecoration: 'none', color: 'white' }}>{this.props.name}</Link></Button>;
    }
  }

export default CalculationSheet;