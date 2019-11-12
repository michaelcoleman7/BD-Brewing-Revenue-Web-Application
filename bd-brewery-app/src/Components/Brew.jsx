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

  let brewsArray;
  if(brews.length > 0){
      brewsArray = <div>
        {brews.map(brew => {
          return(
            <div key={brew._id}>
              <Link to={"brew/"+brew._id}>
                <p>Brew Number: {brew.brewNo} / Beer:{brew.beer}</p>
              </Link>
            </div>
          )
        })}
      </div>
  }else{
    brewsArray = 
    <div>
      <p>No Brews exist in the database, please create a brew</p>
    </div>
  }

return(
    <React.Fragment> 
      <div>
          <h1>Create a Brew</h1>
          <Link to="/createbrew">create a control sheet</Link><br/>
          <Link to="/" >Back</Link><br/><br/>

          {brewsArray}

      </div>
    </React.Fragment>)
  }

export default Brew;