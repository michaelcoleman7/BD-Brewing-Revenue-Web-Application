import React, { useEffect, useState } from 'react';
import XMLParser from 'react-xml-parser';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'

const Map = () => {

  const options = { 
    method: 'GET',
    headers: {
      'Content-Type': 'text/xml',
      'Access-Control-Allow-Origin' : '*'
    }  
  }

    const [breweryIds, setBreweryIds] = useState([]);
    const getBreweryIds = () => {
      fetch("https://cors-anywhere.herokuapp.com/http://beermapping.com/webservice/loccity/752c2c7cdd4721e0e8562153fb2df906/galway", options)
      .then(response => response.text())
      .then(text => {
        console.log(text)
        var xml = new XMLParser().parseFromString(text);
        const brewIds = xml.getElementsByTagName('id');
        console.log(brewIds);
        setBreweryIds(brewIds);
    }
    ).catch(err => {
        console.log(err);
      })
    }
  
    useEffect(() => {
      getBreweryIds();
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

    /*let inventoriesArray;
    if(breweryIds.length > 0){
        inventoriesArray = <div>
          {breweryIds.map(inventory => {
            return(
              <div key={breweryIds.value}>
                <Link to={"/"}>
                  <ListGroup>
                  <center>
                      <ListGroup.Item style={listItem}>{breweryIds.name}</ListGroup.Item>
                  </center>
                  </ListGroup>
                </Link>
              </div>
            )
          })}
        </div>
    }else{
      inventoriesArray = 
      <div>
        <h1 style={{color: "white"}}>No Inventories exist in the database, please create an inventory</h1>
      </div>
    }*/
      const br = breweryIds.map(breweryId => {
        fetch("https://cors-anywhere.herokuapp.com/http://beermapping.com/webservice/locmap/752c2c7cdd4721e0e8562153fb2df906/"+ breweryId.value, options)
        .then(response => response.text())
        .then(text => {
          console.log(text)
          //console.log(breweryId.value)
         var xml = new XMLParser().parseFromString(text);
         const lat = xml.getElementsByTagName('lat');
         const long = xml.getElementsByTagName('lng');
         console.log(lat);
         console.log(long);
          //setBreweryIds(brewIds);
      }
      ).catch(err => {
          console.log(err);
        })
      })



      const ids = <div>
      {breweryIds.map(breweryId => {
        return(
          <div key={breweryId.name}>
            <Link to={"/"}>
              <ListGroup>
              <center>
                  <ListGroup.Item style={listItem}>{breweryId.value}</ListGroup.Item>
              </center>
              </ListGroup>
            </Link>
          </div>
        )
      })}
    </div>

const loc = <div>
{breweryIds.map(breweryId => {
  return(
    <div key={breweryId.name}>
      <Link to={"/"}>
        <ListGroup>
        <center>
            <ListGroup.Item style={listItem}>{breweryId.value}</ListGroup.Item>
        </center>
        </ListGroup>
      </Link>
    </div>
  )
})}
</div>

    return(
        <React.Fragment> 
          <div>
            {ids}
          </div>
        </React.Fragment>)
  }

export default Map;