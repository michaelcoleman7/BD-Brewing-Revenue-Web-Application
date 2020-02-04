import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import {Modal,Button} from 'react-bootstrap';


//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const CreateStockReturn = () => {

  const [inventories, setinventories] = useState([]);
  const [beer, setBeer] = useState([]);
  const [hiddenVal, setHiddenVal] = useState([]);
  const [routeRedirect, setRedirect] = useState(""); 

  const getInventories = () => {
    fetch(url+"api/inventory").then(res =>{
      return res.json();
    }).then(inventories => {
      setinventories(inventories.data);
      setHiddenVal(true);
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
  const handleConfirm = () => {
    setShow(false);
    setRedirect(true);  
  }
  const importChecked = () => {
    if(hiddenVal){
      setHiddenVal(false);
    }
    else{
      setHiddenVal(true);
    }
  }

  const textStyle = {
    display: "inline-block"
  };

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
        <input type="radio" hidden={hiddenVal} name="import"></input>&nbsp;<p style={textStyle} hidden={hiddenVal}>Other Brewery</p> &nbsp;
        <input type="radio"  hidden={hiddenVal} name="import"></input>&nbsp;<p style={textStyle} hidden={hiddenVal}>Imported from Abroad</p>
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
  
  const redirect = routeRedirect;
  let redirectRoute = "/createstockreturn"+ beer
  if(redirect){
       return <Redirect to={redirectRoute} />  
  }

return(
    <React.Fragment> 
            <Button onClick={handleShow}>Choose a Beer</Button>
            {modal}
    </React.Fragment>)
  }

export default CreateStockReturn;