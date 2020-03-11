import React, { useState,useEffect } from 'react';
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import {Card,Button} from 'react-bootstrap';
import '../Stylesheets/Form.css';

// Set some styling for div and form
const divStyle = {
    width: '48%',
    border: '5px',
    background: 'rgba(144, 84, 23, 0.5)',
    padding: '20px',
    margin: '10px'
  };
  const formStyle = {
    width: '100%',
    border: '5px',
    background: 'rgba(144, 84, 23, 0.5)',
    padding: '20px',
    margin: '10px'
  };

  // react arrow function component to create brew infomation
  const ControlBreweryInformation = () => {
    // using react hooks to change states - adapted from https://reactjs.org/docs/hooks-state.html
    const [breweyInfo, setBreweryInfo] = useState("");
    const [brewerName, setBrewerName] = useState("");
    const [address, setAddress] = useState("");
    const [warehouseName, setWarehouseName] = useState("");
    const [IETWNo, setIETWNo] = useState("");
    const [IEWKNo, setIEWKNo] = useState("");
    const [payerRevenueNumber, setPayerRevenueNumber] = useState("");
    const [taxType, setTaxType] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [designationofSignatory, setDesignationofSignatory] = useState("");
    const [routeRedirect, setRedirect] = useState(false); 
    const [showAlert, setAlertShow] = useState(false);
    const [createBrewInfo, setCreateBrewInfo] = useState(false); 
    const [editBrewInfo, setEditBrewInfo] = useState(false); 
    const [infoExists, setInfoExists] = useState(false); 

    // Get brew info from api
    const getBreweryInfo = () => { 
        //fetch info from api using variables
        fetch(process.env.REACT_APP_API_URL+"api/brewinfo").then(res => {
            return res.json();
        }).then(res => {
            //set data from api into variables
            let parsed = JSON.parse(res.data);
            setBreweryInfo(parsed);
            setBrewerName(parsed.brewerName);
            setAddress(parsed.address);
            setWarehouseName(parsed.warehouseName);
            setIETWNo(parsed.IETWNo);
            setIEWKNo(parsed.IEWKNo);
            setPayerRevenueNumber(parsed.payerRevenueNumber);
            setTaxType(parsed.taxType);
            setPhoneNumber(parsed.phoneNumber);
            setDesignationofSignatory(parsed.designationofSignatory);
            setInfoExists(true);
        }).catch(err => {
            setInfoExists(false)
        })
    }

    //call method to api to get brew info
    useEffect(() => {
        getBreweryInfo();
    },[]);

    //function to create brew info and if all info correct send to server
    const create = (event) => {
            event.preventDefault();   

            //brew info values to be sent to server
            const breweryinfo = {
                brewerName: brewerName,
                address: address,
                warehouseName: warehouseName,
                IETWNo: IETWNo,
                IEWKNo: IEWKNo,
                payerRevenueNumber: payerRevenueNumber,
                taxType: taxType,
                phoneNumber: phoneNumber,
                designationofSignatory: designationofSignatory
            }

            //options needed to send request to server
            const options = {
                method: "post",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(breweryinfo)
            }

            //if all data is valid, then post to server
            if( brewerName && address && warehouseName && IETWNo && IEWKNo && payerRevenueNumber && taxType && phoneNumber && designationofSignatory){
                if(isNaN(parseInt(IETWNo)) || isNaN(parseInt(IEWKNo)) || isNaN(parseInt(phoneNumber))){
                    setAlertShow(!showAlert);
                    console.log("Invalid form format, will not be sent to database");
                }
                else{
                    //post user entered data to server
                    fetch(process.env.REACT_APP_API_URL +"api/createbrewinfo", options)
                    .then(res => {
                        //set redirect to true - calls redirect method
                        setRedirect(true);
                        return res.json();
                    }).catch(err => {
                        console.log(err)
                    })
                }            
            }else{
                //display that user entered info is invalid
                setAlertShow(!showAlert);
            }
        
    }

    let alertFormError;
    // when showalert is true then show alert with error data
    if(showAlert){
        alertFormError =
            <React.Fragment>
                <Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
                    <Alert.Heading>Invalid Form Format!</Alert.Heading>
                    <p>
                        Please ensure all form fields are filled out. Also ensure numberical values are displayed for correct fields
                    </p>
                </Alert>
            </React.Fragment>
    }

    //function to show create form
    const createItem = () => {
        setCreateBrewInfo(!createBrewInfo);
    }

    //function to show edit form
    const editBreweryInfo = () => {
        setEditBrewInfo(!editBrewInfo);
    }

    //function to allow deletion of item
    const deleteItem = () => {
        const options = { 
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify()
          } 
          fetch(process.env.REACT_APP_API_URL+"api/deletebrewinfo" , options)
          .then(res => {
            return res.json()
           })
           .then(res => {
               console.log(res);
               setRedirect(true);
           }).catch(err => {
               console.log(err)
           })
    }

    // Redirect to home page after creation
    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to="/"/>  
    }

    let form;
    // show form to create brew info
    if(createBrewInfo){
        form =
            <React.Fragment>
                <form style={formStyle} onSubmit={create}>
                        <label>Brewer Name</label>
                        <input type="text" placeholder="Enter Brewer Name" onChange={event => setBrewerName(event.target.value)}/>
                    <div style={divStyle} className="float-left">

                        <label>Address</label>
                        <input type="text" placeholder="Enter Address" onChange={event => setAddress(event.target.value)}/>

                        <label>Warehouse Name</label>
                        <input type="text" placeholder="Enter Warehouse Name" onChange={event => setWarehouseName(event.target.value)}/>

                        <label>IETW (Tax Warehouse) Number - Number required</label>
                        <input type="text" placeholder="Enter IETW" onChange={event => setIETWNo(event.target.value)}/>

                        <label>IEWK (Warehouse Keeper) Number - Number required</label>
                        <input type="text" placeholder="Enter IEWK" onChange={event => setIEWKNo(event.target.value)}/>
                    </div>
                    <div className="float-right" style={divStyle}>

                        <label>Payer Revenue Number</label>
                        <input type="text" placeholder="Enter Payer Revenue Number" onChange={event => setPayerRevenueNumber(event.target.value)}/>

                        <label>Tax Type</label>
                        <input type="text"  placeholder="Enter Tax Type paid by Brewery" onChange={event => setTaxType(event.target.value)}/>

                        <label>Phone Number - Number required</label>
                        <input type="text"  placeholder="Enter Phone Number" onChange={event => setPhoneNumber(event.target.value)}/>

                        <label>Brewer Designation</label>
                        <input type="text"  placeholder="Enter Brewer Designation" onChange={event => setDesignationofSignatory(event.target.value)}/>


                    </div>
                    <input type="submit" value="Create Brewery Information"/>
                    {alertFormError}
                </form>
            </React.Fragment>
    // Display form with api data in fields
    }else if(editBrewInfo){
        form =
        <React.Fragment>
            <form style={formStyle} onSubmit={create}>
                    <label>Brewer Name</label>
                    <input type="text" placeholder="Enter Brewer Name" onChange={event => setBrewerName(event.target.value)} defaultValue={breweyInfo.brewerName}/>
                <div style={divStyle} className="float-left">

                    <label>Address</label>
                    <input type="text" placeholder="Enter Address" onChange={event => setAddress(event.target.value)} defaultValue={breweyInfo.address}/>

                    <label>Warehouse Name</label>
                    <input type="text" placeholder="Enter Warehouse Name" onChange={event => setWarehouseName(event.target.value)} defaultValue={breweyInfo.warehouseName}/>

                    <label>IETW (Tax Warehouse) Number - Number required</label>
                    <input type="text" placeholder="Enter IETW" onChange={event => setIETWNo(event.target.value)} defaultValue={breweyInfo.IETWNo}/>

                    <label>IEWK (Warehouse Keeper) Number - Number required</label>
                    <input type="text" placeholder="Enter IEWK" onChange={event => setIEWKNo(event.target.value)} defaultValue={breweyInfo.IEWKNo}/>
                </div>
                <div className="float-right" style={divStyle}>

                    <label>Payer Revenue Number</label>
                    <input type="text" placeholder="Enter Payer Revenue Number" onChange={event => setPayerRevenueNumber(event.target.value)} defaultValue={breweyInfo.payerRevenueNumber}/>

                    <label>Tax Type</label>
                    <input type="text"  placeholder="Enter Tax Type paid by Brewery" onChange={event => setTaxType(event.target.value)} defaultValue={breweyInfo.taxType}/>

                    <label>Phone Number - Number required</label>
                    <input type="text"  placeholder="Enter Phone Number" onChange={event => setPhoneNumber(event.target.value)} defaultValue={breweyInfo.phoneNumber}/>

                    <label>Brewer Designation</label>
                    <input type="text"  placeholder="Enter Brewer Designation" onChange={event => setDesignationofSignatory(event.target.value)} defaultValue={breweyInfo.designationofSignatory}/>


                </div>
                <input type="submit" value="Update Brewery Information"/>
                {alertFormError}
            </form>
        </React.Fragment>
    }


    let infoDisplay;
    //if a brew info document exists then show data
    if(infoExists){
        infoDisplay =
            <React.Fragment>
            <center>
            <Card style={{ width: '50%' }}>
                <Card.Body>
                    <Card.Title><h3><b>Brewery Information</b></h3></Card.Title>
                    <Card.Text>
                        <b>Brewer Name:</b>  {breweyInfo.brewerName}<br/>
                        <b>Address:</b>  {breweyInfo.address}<br/>
                        <b>Warehouse Name:</b>  {breweyInfo.warehouseName}<br/>
                        <b>IETW Number:</b>  {breweyInfo.IETWNo}<br/>
                        <b>IEWK Number:</b>  {breweyInfo.IEWKNo}<br/>
                        <b>Payer Revenue Number:</b>  {breweyInfo.payerRevenueNumber}<br/>
                        <b>Tax Type:</b>  {breweyInfo.taxType}<br/>
                        <b>Phone Number:</b>  {breweyInfo.phoneNumber}<br/>
                        <b>Designation of Signatory (for signing warrent):</b>  {breweyInfo.designationofSignatory}<br/>
                    </Card.Text>
                </Card.Body>
            </Card></center><br/>
            <Button onClick={(e) => editBreweryInfo()}>Edit Brewery Information</Button>&nbsp;
            <Button onClick={(e) => deleteItem()}>Delete Brewery Information</Button>
            </React.Fragment>
    }
    //otherwise show user option to create data
    else{
        infoDisplay = <React.Fragment>
        <center>
        <Card style={{ width: '50%' }}>
            <Card.Body>
                <Card.Title><h3><b>Brewery Information: No Brewery Information Available</b></h3></Card.Title>
                <Card.Text>
                    <p>Please create brewery information by pressing the button below</p>
                    <Button className="edit" onClick={(e) => createItem()}>Create Brew Information</Button>
                </Card.Text>
            </Card.Body>
        </Card></center>
        </React.Fragment>
    }

    //return binded elements for display based on api call's return info
    return(
        <React.Fragment> 
            {infoDisplay}
            {form}
        </React.Fragment>)
}
    
// Export component for use
export default ControlBreweryInformation;