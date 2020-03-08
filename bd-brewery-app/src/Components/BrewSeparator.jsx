import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

// component to separate all brews by beers
const BrewSeparator = () => {
  const [brews, setbrews] = useState([]);
  //method to fetch brews from the api
  const getBrews = () => {
    //fetch api data from server using enviornment variable
    fetch(process.env.REACT_APP_API_URL+"api/brew").then(res =>{
      return res.json();
    }).then(brews => {
      //set brews array
      setbrews(brews.data);
    }).catch(err => {
      console.log(err);
    })
  }

  // get brews from api call by calling getBrews()
  useEffect(() => {
    getBrews();
  }, [])

  // css for each list item
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
  // For each beer in brews put them in a list
  for (var i = 0; i < brews.length; i++) {
    if(!beerlist.includes(brews[i].beer)){
      beerlist.push(brews[i].beer);
    }
  }
  let brewsArray;
  // for each beer added to list then map to a link and dispaly to user
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
    //if nothing in list then display to user that none exist
    brewsArray = 
    <div>
      <h1 style={{color: "white"}}>No Brews exist in the database, please create a brew</h1>
    </div>
  }

// return react fragment to display for user
return(
    <React.Fragment> 
      <div>
      <h2 style={{color: "white"}}>Brews: By Beer Name</h2>
        {brewsArray}
      </div>
    </React.Fragment>)
  }
//export component for use
export default BrewSeparator;