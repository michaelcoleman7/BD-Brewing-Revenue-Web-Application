import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import {Modal,Button} from 'react-bootstrap';
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';

//component to show user the current warrent
const Warrant = () => {
  const [repaymentsAllowed, setRepaymentsAllowed] = useState("");
  const [stockReturns, setStockReturns] = useState([]);
  const [stockreturnLength, setStockreturnLength] = useState(0);
  const [totalDutyOwed, setTotalDutyOwed] = useState("");
  const [totalHLPercent, setTotalHLPercent] = useState("");
  const [routeRedirect, setRedirect] = useState(false); 
  const [showAlert, setAlertShow] = useState(false);

  const getStockReturns = () => {
    //add options with headers to ensure authorization
    const options = {
      method: "get",
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
      }
    }

    // fetch stock return data from api
    fetch(process.env.REACT_APP_API_URL+"api/stockreturn",options).then(res =>{
      return res.json();
    }).then(stockReturns => {
      setStockReturns(stockReturns.data);
      setStockreturnLength(stockReturns.data.length);
    }).catch(err => {
      console.log(err);
    })
  }
  useEffect(() => {
    getStockReturns();
  }, [])

  // set up modal functions
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = (event) => { 
    //if all are not default values, then all have been entered
    if(totalDutyOwed != ""  && totalHLPercent !="" && repaymentsAllowed !=""){
      setRedirect(true);
    }
    else{
      setShow(false);
      setAlertShow(!showAlert);
    }
  }

  const redirect = routeRedirect;
  // Set up redirect for navigation
  if(redirect){
       return <Redirect to={{
        pathname: '/Warrantdisplay',
        //props to send with redirection
        state: { repaymentsAllowed: repaymentsAllowed, totalDutyOwed:totalDutyOwed, totalHLPercent:totalHLPercent }
    }}/>  
  }

  //add stock return info into list for options display
  let stockreturnlist = []
  for (var i = 0; i < stockreturnLength; i++) {
    //concat beer and date to show identifing information of a stock return - could have multiple of same name with a different month
    var infoconcat = stockReturns[i].beer +" : "+ stockReturns[i].stockReturnDate
    stockreturnlist.push(infoconcat);
  }


  //function to set stock return to user selected stock return
  const setSelectedStockReturn= (event) => {
    for (var i = 0; i < stockReturns.length; i++) {
        if(stockReturns[i].beer +" : "+ stockReturns[i].stockReturnDate == event.target.value ){
            setTotalDutyOwed(stockReturns[i].totalDutyOwed);
            setTotalHLPercent(stockReturns[i].totalHLPercent);
        }
    }   
  }
    
    
  //set up beers as dropdown options for user in creation via mapping
  const stockReturnOptions = stockreturnlist.map((beer) =>
    <option>{beer}</option>
  );

  let alertError;
  //if showalert = true, then show alert with error data
  if(showAlert){
    alertError =
          <React.Fragment>
              <center>
              <Alert style={{width: "33%"}} variant="danger" onClose={() => setAlertShow(false)} dismissible>
                  <Alert.Heading>Invalid Warrant Format!</Alert.Heading>
                  <p>
                      Please ensure to choose a Stock Return and a repayments value. (Number)
                  </p>
              </Alert>
              </center>
          </React.Fragment>
  }

  //set modal up for when user clicks create warrent, it pops up with user creation options
  let modal =       
  <div>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title><b>Enter Repayments Allowed</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
        <select onChange={event => setSelectedStockReturn(event)}>
          <option>Select a Stock Return...</option>
          {stockReturnOptions}
        </select><br/>
        <label style={{color: "black"}}>Repayments - Hectolitre %, to be taken away from Total Duty</label>
        <input type="text" onChange={event => setRepaymentsAllowed(event.target.value)}/></div>
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
      <h1 style={{color: 'white'}}>Warrant Management</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={{width: '28rem'}}>          
              <Link onClick={handleShow}> <Card.Img src={require("../Images/warrant.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title className="custom-card">View a Warrant</Card.Title>
                <Card.Text className="custom-card-text">
                  View Warrant using a stock return to be sent to revenue.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
      {modal}<br/>
      {alertError}
    </React.Fragment>)
  }

export default Warrant;