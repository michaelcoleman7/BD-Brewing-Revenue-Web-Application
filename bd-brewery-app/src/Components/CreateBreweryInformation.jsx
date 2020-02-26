import React, { useState } from 'react';
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import '../Stylesheets/Form.css';

//set the url to send the data to
const url = "http://127.0.0.1:5000/"

// Set some styling for div
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



  // react arrow function component to create a brew
  const CreateBrew = () => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
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

    const create = (event) => {
            event.preventDefault();   

            //brew values to be sent to server
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
                    fetch(url +"api/createbrewinfo", options)
                    .then(res => {
                        setRedirect(true);
                        return res.json();
                    }).catch(err => {
                        console.log(err)
                    })
                }            
            }else{
                setAlertShow(!showAlert);
                console.log("Invalid form format, will not be sent to database");
            }
        
    }

    let alertFormError;
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

    // Redirect to brew page after creation
    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to="/brewInfo" />  
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
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

        </React.Fragment>)
}
    

export default CreateBrew;