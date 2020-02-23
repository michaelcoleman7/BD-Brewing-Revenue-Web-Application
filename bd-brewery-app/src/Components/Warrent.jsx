import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import {Modal,Button} from 'react-bootstrap';
import { Redirect } from 'react-router';

const url = "http://127.0.0.1:5000/"

const Warrent = () => {
  const [totalDutyOwed, setTotalDutyOwed] = useState([]);
  const [totalHLPercent, setTotalHLPercent] = useState([]);
  const [repaymentsAllowed, setRepaymentsAllowed] = useState([]);
  const [routeRedirect, setRedirect] = useState(false); 
  const getStockReturns = () => {
    fetch(url+"api/stockreturn").then(res =>{
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

  const divStyle = {
    width: '28rem'
  };

  const header = {
    color: 'white'
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = (event) => { 
    setRedirect(true);
  }

  const redirect = routeRedirect;
  if(redirect){
       return <Redirect to={{
        pathname: '/warrentdisplay',
        state: { repaymentsAllowed: repaymentsAllowed, totalDutyOwed:totalDutyOwed, totalHLPercent:totalHLPercent }
    }}/>  
  }

  let modal =       
  <div>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Warrent Less Repayments Allowed</Modal.Title>
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

return(
    <React.Fragment> 
      <h1 style={header}>Warrent Management</h1>
      <div class="d-flex justify-content-around">
            <Card bg="primary" style={divStyle}>          
              <Link onClick={handleShow}> <Card.Img src={require("../Images/Background1.jpg")} height="300"/></Link>
              <Card.Body>
                <Card.Title>View Current Warrent</Card.Title>
                <Card.Text>
                  View warrent to be sent to revenue.
                </Card.Text>
              </Card.Body>
            </Card>
      </div>
      {modal}
    </React.Fragment>)
  }

export default Warrent;