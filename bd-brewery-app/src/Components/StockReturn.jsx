import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import Card from 'react-bootstrap/Card';
import {Modal,Button} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';

const StockReturn = () => {
  const [inventories, setinventories] = useState([]);
  const [beer, setBeer] = useState([]);
  const [hiddenValRec, setHiddenValRec] = useState([]);
  const [hiddenValDel, setHiddenValDel] = useState([]);
  const [otherBreweryCheckRec, setOtherBreweryCheckRec] = useState([]);
  const [otherCountryCheckRec, setOtherCountryCheckRec] = useState([]);
  const [otherBreweryCheckDel, setOtherBreweryCheckDel] = useState([]);
  const [otherCountryCheckDel, setOtherCountryCheckDel] = useState([]);
  const [routeRedirect, setRedirect] = useState(""); 
  const [monthDate, setMonthDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("None Selected");

  const getInventories = () => {
    fetch(process.env.REACT_APP_API_URL+"api/inventory").then(res =>{
      return res.json();
    }).then(inventories => {
      setinventories(inventories.data);
      //set initial values for data
      setBeer(null);
      setHiddenValRec(true);
      setHiddenValDel(true);
      setOtherBreweryCheckRec(false);
      setOtherCountryCheckRec(false);
      setOtherBreweryCheckDel(false);
      setOtherCountryCheckDel(false);
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
        otherBreweryCheckRec: otherBreweryCheckRec,
        otherCountryCheckRec: otherCountryCheckRec,
        otherBreweryCheckDel: otherBreweryCheckDel,
        otherCountryCheckDel: otherCountryCheckDel,
        monthDate: monthDate
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

    if(beer && monthDate){
      fetch(process.env.REACT_APP_API_URL +"api/createstockreturn", options)
      .then(res => {
          setRedirect(true);
          return res.json();
      }).catch(err => {
          console.log(err)
      })    
    }
    setShow(false);
  }
  const importRecChecked = () => {
    if(hiddenValRec){
      setHiddenValRec(false);
    }
    else{
      setHiddenValRec(true);
      setOtherBreweryCheckRec(false);
      setOtherCountryCheckRec(false);
    }
  }

  const importDelChecked = () => {
    if(hiddenValDel){
      setHiddenValDel(false);
    }
    else{
      setHiddenValDel(true);
      setOtherBreweryCheckDel(false);
      setOtherCountryCheckDel(false);
    }
  }

  const swapRadiosRec = (event) => {
    if(otherBreweryCheckRec){
      setOtherCountryCheckRec(true);
      setOtherBreweryCheckRec(false);
    }
    else if(!otherBreweryCheckRec){
      setOtherBreweryCheckRec(true);
      setOtherCountryCheckRec(false);
    }
  }

  const swapRadiosDel = (event) => {
    if(otherBreweryCheckDel){
      setOtherCountryCheckDel(true);
      setOtherBreweryCheckDel(false);
    }
    else if(!otherBreweryCheckDel){
      setOtherBreweryCheckDel(true);
      setOtherCountryCheckDel(false);
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

  let newDate;
  const dateChange = (date) => {
          newDate = format(new Date(date), 'MM-yyyy')
          setMonthDate(newDate);
          setSelectedMonth(newDate);
  }

  let modal =       
  <div>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Beer for the new Stock Return</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <select onChange={event => setUpBeers(event)}>
          <option>Select a Beer...</option>
          {beersList}
        </select><br/>
        <input type="checkbox" id="importRec" onChange={importRecChecked}></input> Receipts External Brewery import<br/>
        <label hidden={hiddenValRec}>Receipts: </label> <input type="radio" hidden={hiddenValRec} name="importRec" checked={otherBreweryCheckRec} onChange={event =>swapRadiosRec(event)}></input>&nbsp;<p style={textStyle} hidden={hiddenValRec}>Other Brewery</p> &nbsp;
        <input type="radio"  hidden={hiddenValRec} name="importRec" checked={otherCountryCheckRec} onChange={event =>swapRadiosRec(event)}></input>&nbsp;<p style={textStyle} hidden={hiddenValRec}>Imported from Abroad</p>
        <br/>
        <input type="checkbox" id="importDel" onChange={importDelChecked}></input> Deliveries External Brewery import<br/>
        <label hidden={hiddenValDel}>Deliveries: </label> <input type="radio" hidden={hiddenValDel} name="importDel" checked={otherBreweryCheckDel} onChange={event =>swapRadiosDel(event)}></input>&nbsp;<p style={textStyle} hidden={hiddenValDel}>Other Brewery</p> &nbsp;
        <input type="radio"  hidden={hiddenValDel} name="importDel" checked={otherCountryCheckDel} onChange={event =>swapRadiosDel(event)}></input>&nbsp;<p style={textStyle} hidden={hiddenValDel}>Imported from Abroad</p>
        <DatePicker format="MM/yyyy" onChange={event => dateChange(event)}/> Date Selected: {selectedMonth}
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