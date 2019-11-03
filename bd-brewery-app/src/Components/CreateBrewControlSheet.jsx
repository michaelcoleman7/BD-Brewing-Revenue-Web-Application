import React, { Component, useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import '../Stylesheets/Form.css';


const divStyle = {
    width: '500px',
    border: '5px',
    background: '#f2f2f2',
    padding: '20px',
    margin: '10px'
  };
  
class CreateBrewControlSheet extends React.Component {

    render() {
      return(
      <React.Fragment> 
        <div style={divStyle}>
            <form onSubmit={createcontrolsheet}>
                <label>Brew No.</label>
                <input type="text" name="BrewNo" placeholder="Enter Brew Number"/>

                <label>Beer</label>
                <input type="text" name="beer" placeholder="Enter Beer"/>
            
                <input type="submit" value="Submit"/>
            </form>
        </div>
    </React.Fragment>)
    }
  }

export default CreateBrewControlSheet;