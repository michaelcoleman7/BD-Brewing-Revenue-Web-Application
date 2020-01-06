import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const BrewList = () => {

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

  const listItem = {
    width: '18rem',
    width: '50%',
    color: 'black'
  };


  let brewsArray;
  if(brews.length > 0){
      brewsArray = <div>
        {brews.map(brew => {
          return(
            <div key={brew._id}>
              <Link to={"brew/"+brew._id}>
                <ListGroup>
                <center>
                    <ListGroup.Item style={listItem}>{brew.brewName}</ListGroup.Item>
                </center>
                </ListGroup>
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
        {brewsArray}
      </div>
    </React.Fragment>)
  }

export default BrewList;