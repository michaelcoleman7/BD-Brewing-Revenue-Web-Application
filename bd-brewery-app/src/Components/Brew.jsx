import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Brew extends React.Component {
    render() {
      return <div>
          <h1>Create a Brew</h1>
          <Link to="/createbrew">create a control sheet</Link><br/>
          <Link to="/" >Back</Link>
      </div>;
    }
  }

export default Brew;