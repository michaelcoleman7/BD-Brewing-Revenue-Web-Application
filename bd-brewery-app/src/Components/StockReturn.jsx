import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import Card from 'react-bootstrap/Card';
import {Modal,Button} from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';

//Component to create stock returns aswell as ability to navigate to viewing stock returns
const StockReturn = () => {
  const [inventories, setinventories] = useState([]);
  const [invLength, setInvLength] = useState(0);
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

  //function to get inventories - used to create a stock return
  const getInventories = () => {
    //add options with headers to ensure authorization
    const options = {
      method: "get",
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
      }
    }
    
    //fetch inventory data from api
    fetch(process.env.REACT_APP_API_URL+"api/inventory",options).then(res =>{
      return res.json();
    }).then(inventories => {
      //set inventories
      setinventories(inventories.data);
      setInvLength(inventories.data.length)

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
  //set up beers into a list to allow beer selection used in stock return
  for (var i = 0; i < invLength; i++) {
      if(!inventorylist.includes(inventories[i].beer)){
        inventorylist.push(inventories[i].beer);
      }
  }

  //function to set beer to user selected beer
  const setUpBeers= (event) => {
    for (var i = 0; i < inventorylist.length; i++) {
        if(inventorylist[i] == event.target.value ){
            setBeer(inventorylist[i]);
        }
    }   
  }
  //set up beers as dropdown options for user in creation via mapping
  const beersList = inventorylist.map((beer) =>
    <option>{beer}</option>
  );

  //set up values used for modal show and confirmation of creation of stock return
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = (event) => {
    event.preventDefault();   

    //stock return values to be sent to server
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
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
  //function for showing import values to user based on user selection - Reciepts
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

  //function for showing import values to user based on user selection - Deliveries
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

  //function for setting up import values based on user selection - Reciepts
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

  //function for setting up import values based on user selection - Deliveries
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

  //setup redirection to allow navigation from page
  const redirect = routeRedirect;
  let redirectRoute = "/stockreturnlist"
  if(redirect){
    return <Redirect to={redirectRoute} />  
  }

  let newDate;
  //function to set up dates based on user selection
  const dateChange = (date) => {
    newDate = format(new Date(date), 'MM-yyyy')
    setMonthDate(newDate);
    setSelectedMonth(newDate);
  }

  //set modal up for when user clicks create stock reurn, it pops up with user creation options
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
        <label hidden={hiddenValRec}>Receipts: </label> <input type="radio" hidden={hiddenValRec} name="importRec" checked={otherBreweryCheckRec} onChange={event =>swapRadiosRec(event)}></input>&nbsp;<p style={{display: "inline-block"}} hidden={hiddenValRec}>Other Brewery</p> &nbsp;
        <input type="radio"  hidden={hiddenValRec} name="importRec" checked={otherCountryCheckRec} onChange={event =>swapRadiosRec(event)}></input>&nbsp;<p style={{display: "inline-block"}} hidden={hiddenValRec}>Imported from Abroad</p>
        <br/>
        <input type="checkbox" id="importDel" onChange={importDelChecked}></input> Deliveries External Brewery import<br/>
        <label hidden={hiddenValDel}>Deliveries: </label> <input type="radio" hidden={hiddenValDel} name="importDel" checked={otherBreweryCheckDel} onChange={event =>swapRadiosDel(event)}></input>&nbsp;<p style={{display: "inline-block"}} hidden={hiddenValDel}>Other Brewery</p> &nbsp;
        <input type="radio"  hidden={hiddenValDel} name="importDel" checked={otherCountryCheckDel} onChange={event =>swapRadiosDel(event)}></input>&nbsp;<p style={{display: "inline-block"}} hidden={hiddenValDel}>Imported from Abroad</p>
        <DatePicker format="MM/yyyy" onChange={event => dateChange(event)}/> Date Selected: <b>{selectedMonth}</b>
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

//return elements to display to user
return(
    <React.Fragment> 
      <h1 style={{color: 'white'}}>Stock Returns</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={{width: '28rem'}}>          
              <Link onClick={handleShow}> <Card.Img src={require("../Images/stein.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title className="custom-card">Create Stock Return</Card.Title>
                <Card.Text className="custom-card-text">
                  Create a new Stock return based on an existing Inventory.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card bg="success" style={{width: '28rem'}}>          
              <Link to="/stockreturnlist"> <Card.Img src={require("../Images/Cheers.PNG")} height="300"/></Link>
              <Card.Body>
                <Card.Title className="custom-card">View Stock Returns</Card.Title>
                <Card.Text className="custom-card-text">
                  View all existing Stock Returns.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
      {modal}
    </React.Fragment>)
  }
//Export component for use
export default StockReturn;