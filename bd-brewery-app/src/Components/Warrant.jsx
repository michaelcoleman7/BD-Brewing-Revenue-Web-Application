import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import {Modal,Button} from 'react-bootstrap';
import { Redirect } from 'react-router';

//component to show user the current warrent
const Warrant = () => {
  const [totalDutyOwed, setTotalDutyOwed] = useState([]);
  const [totalHLPercent, setTotalHLPercent] = useState([]);
  const [repaymentsAllowed, setRepaymentsAllowed] = useState([]);
  const [routeRedirect, setRedirect] = useState(false); 
  const getStockReturns = () => {
    // fetch stock return data from api
    fetch(process.env.REACT_APP_API_URL+"api/stockreturn").then(res =>{
      return res.json();
    }).then(stockReturns => {
      // [stockReturns.data.length-1] - Get the latest stock return which was created - newest totals incase old ones are outdated
      setTotalDutyOwed(stockReturns.data[stockReturns.data.length-1].totalDutyOwed);
      setTotalHLPercent(stockReturns.data[stockReturns.data.length-1].totalHLPercent);
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
    setRedirect(true);
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

  //set modal up for when user clicks create warrent, it pops up with user creation options
  let modal =       
  <div>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Warrant Less Repayments Allowed</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
        <label>Hectolitre %</label>
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
                <Card.Title>View Current Warrant</Card.Title>
                <Card.Text>
                  View Warrant to be sent to revenue.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
      {modal}
    </React.Fragment>)
  }

export default Warrant;