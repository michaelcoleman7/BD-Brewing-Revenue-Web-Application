import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const BrewSeparator = () => {

  const [brews, setbrews] = useState([]);
  const [beers, setBeers] = useState([]);
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

  let beerlist = []
  for (var i = 0; i < brews.length; i++) {
      if(beerlist.includes(brews[i].beer)){
          //console.log("Duplicate found: "+brews[i].beer);
      }
      else{
          beerlist.push(brews[i].beer);
      }
  }
  let brewsArray;
  if(beerlist.length > 0){
      brewsArray = <div>
        {beerlist.map(beer => {
          return(
            <div key={beer}>
              <Link to={"brewlist/"+beer}>
                <ListGroup>
                <center>
                    <ListGroup.Item style={listItem}>{beer}</ListGroup.Item>
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

export default BrewSeparator;