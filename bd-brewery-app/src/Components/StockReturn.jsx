import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import Card from 'react-bootstrap/Card';
import {Modal,Button} from 'react-bootstrap';


//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const StockReturn = () => {
  const [inventories, setinventories] = useState([]);
  const [beer, setBeer] = useState([]);
  const [hiddenVal, setHiddenVal] = useState([]);
  const [otherBreweryCheck, setOtherBreweryCheck] = useState([]);
  const [otherCountryCheck, setOtherCountryCheck] = useState([]);
  const [routeRedirect, setRedirect] = useState(""); 

  const getInventories = () => {
    fetch(url+"api/inventory").then(res =>{
      return res.json();
    }).then(inventories => {
      setinventories(inventories.data);
      //set initial values for data
      setBeer(null);
      setHiddenVal(true);
      setOtherBreweryCheck(false);
      setOtherCountryCheck(false);
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getInventories();
  }, [])

  let inventorylist = []
  for (var i = 0; i < inventories.length; i++) {
      if(inventorylist.includes(inventories[i].beer)){}
      else{
          inventorylist.push(inventories[i].beer);
      }
  }

  const setUpBeers= (event) => {
    for (var i = 0; i < inventorylist.length; i++) {
        if(inventorylist[i] == event.target.value ){
            setBeer(inventorylist[i]);
        }
    }   
  }

  const beersList = inventorylist.map((beer) =>
  <option>{beer}</option>
  );

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = (event) => {
    event.preventDefault();   

    //brew values to be sent to server
    const stockreturn = {
        beer: beer,
        otherBreweryCheck: otherBreweryCheck,
        otherCountryCheck: otherCountryCheck
    }

    //options needed to send request to server
    const options = {
        method: "post",
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockreturn)
    }

    //if all data is valid, then post to server

    if(beer){
      fetch(url +"api/createstockreturn", options)
      .then(res => {
          setRedirect(true);
          return res.json();
      }).catch(err => {
          console.log(err)
      })    
    }else{
        //setAlertShow(!showAlert);
        console.log("Invalid form format, will not be sent to database");
    }
    setShow(false);
    setRedirect(true);  
  }
  const importChecked = () => {
    if(hiddenVal){
      setHiddenVal(false);
    }
    else{
      setHiddenVal(true);
      setOtherBreweryCheck(false);
      setOtherCountryCheck(false);
    }
  }

  const swapRadios = (event) => {
    if(otherBreweryCheck){
      setOtherCountryCheck(true);
      setOtherBreweryCheck(false);
    }
    else{
      setOtherBreweryCheck(true);
      setOtherCountryCheck(false);
    }
  }
  const divStyle = {
    width: '28rem'
  };

  const header = {
    color: 'white'
  };

  const textStyle = {
    display: "inline-block"
  };

  const redirect = routeRedirect;
  let redirectRoute = "/stockreturnlist"
  if(redirect){
       return <Redirect to={redirectRoute} />  
  }

  let modal =       
  <div>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Beer for the new Stock Return</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <select onChange={event => setUpBeers(event)}>
        <option>Select a Batch Number...</option>
        {beersList}
      </select><br/>
      <input type="checkbox" id="import" name="import" onChange={importChecked}></input> External Brewery import<br/>
      <input type="radio" hidden={hiddenVal} name="import" checked={otherBreweryCheck} onChange={event =>swapRadios(event)}></input>&nbsp;<p style={textStyle} hidden={hiddenVal}>Other Brewery</p> &nbsp;
      <input type="radio"  hidden={hiddenVal} name="import" checked={otherCountryCheck} onChange={event =>swapRadios(event)}></input>&nbsp;<p style={textStyle} hidden={hiddenVal}>Imported from Abroad</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </div>

return(
    <React.Fragment> 
      <h1 style={header}>Stock Returns</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link onClick={handleShow}> <Card.Img src={require("../Images/stein.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title>Create Stock Return</Card.Title>
                <Card.Text>
                  Create a new Stock return based on an existing Inventory.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card bg="success" style={divStyle}>          
              <Link to="/stockreturnlist"> <Card.Img src={require("../Images/Cheers.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Stock Returns</Card.Title>
                <Card.Text>
                  View all existing Stock Returns.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
      {modal}
    </React.Fragment>)
  }

export default StockReturn;