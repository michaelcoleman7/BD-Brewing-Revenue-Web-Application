import React, { Component, useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const Brew = () => {

  const [brews, setbrews] = useState([]);
  const getBrews = () => {
    fetch(url+"api/brew").then(res =>{
      return res.json();
    }).then(brews => {
      console.log(brews);
      setbrews(brews.data);
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getBrews();
  }, [])

return(
    <React.Fragment> 
      <div>
          <h1>Create a Brew</h1>
          <Link to="/createbrew">create a control sheet</Link><br/>
          <Link to="/" >Back</Link>
      </div>
    </React.Fragment>)
  }

export default Brew;