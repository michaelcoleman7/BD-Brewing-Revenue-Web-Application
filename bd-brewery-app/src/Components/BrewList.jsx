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
    width: '40%',
    color: 'white',
    marginTop: '10px',
    fontFamily: 'Cursive',
    fontSize: '20px',
    borderStyle: 'solid',
    borderColor: 'brown',
    background: 'rgba(144, 84, 23, 0.5)'
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
                    <ListGroup.Item style={listItem}>{brew.productName}</ListGroup.Item>
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
      <h1 style={{color: "white"}}>No Brews exist in the database, please create a brew</h1>
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