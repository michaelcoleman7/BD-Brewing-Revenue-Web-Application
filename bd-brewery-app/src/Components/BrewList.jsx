import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const BrewList = (props) => {
  const [brews, setbrews] = useState([]);
  const getBrews = () => {
    //console.log(props.match.params.beer)
    fetch(url+"api/brew").then(res =>{
      return res.json();
    }).then(brews => {
      //console.log(brews);
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
    console.log(brews[i].batchNo);
      if(brews[i].beer == props.match.params.beer){
        beerlist.push(brews[i]);
        //console.log("added");
      }
      else{
        //console.log(brews[i].batchNo);
      }
  }
  
  let brewsArray;
  let counter = 0;
  if(beerlist.length > 0){
      brewsArray = <div>
        {beerlist.map(brew => {
          return(
            <div key={counter}>
              <Link to={"../brew/"+brew._id}>
                <ListGroup>
                <center>
                    <ListGroup.Item style={listItem}>{brew.batchNo}</ListGroup.Item>
                </center>
                </ListGroup>
              </Link>
            </div>
          )
          counter++;
        })}
      </div>
  }else{
    brewsArray = 
    <div>
      <h2 style={{color: "white"}}>No Brews exist  for this beer in the database, please create a brew of this beer type</h2>
    </div>
  }

return(
    <React.Fragment> 
      <div>
      <h1 style={{color: "white"}}>Brew: {props.match.params.beer} - Batch Numbers</h1>
        {brewsArray}
      </div>
    </React.Fragment>)
  }

export default BrewList;