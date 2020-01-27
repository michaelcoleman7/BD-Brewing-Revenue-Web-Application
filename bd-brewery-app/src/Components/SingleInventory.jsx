import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card'
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import '../Stylesheets/Form.css';

//set the url to send the data to
const url = "http://localhost:5000/"

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

  // react arrow function component to create a inventory
  const SingleInventory = (props) => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [productName, setProductName] = useState("");
    const [inventoryId, setInventoryId] = useState("");
    const [inventory, setInventory] = useState("");
    const [changeInventory, setChangeInventory] = useState(false); 

    const [totalCasesSold500Month, setTotalCasesSold500Month] = useState("");
    const [remainingCases500, setRemainingCases500] = useState("");
    const [totalCasesSold330Month, setTotalCasesSold330Month] = useState("");
    const [remainingCases330, setRemainingCases330] = useState("");
    const [totalKegsSoldMonth, setTotalKegsSoldMonth] = useState("");
    const [remainingKegs, setRemainingKegs] = useState("");
    const [openingStock330Cases, setOpeningStock330Cases] = useState("");
    const [openingStock500Cases, setOpeningStock500Cases] = useState("");
    const [openingStockKegs, setOpeningStockKegs] = useState("");
    const [receipts330Cases, setReceipts330Cases] = useState("");
    const [receipts500Cases, setReceipts500Cases] = useState("");
    const [receiptsKegs, setReceiptsKegs] = useState("");
    const [routeRedirect, setRedirect] = useState(""); 
    const [showAlert, setAlertShow] = useState(false);

    const getInventory = () => {
        let id = props.match.params.id;

        // Remove all the "" from the id - 
        //Note: Adding the /g will mean that all of the matching values are replaced,
        //otherwise just 1st occurance removed- https://stackoverflow.com/questions/1206911/why-do-i-need-to-add-g-when-using-string-replace-in-javascript
        let quotationlessId = id.replace(/['"]+/g, "");     

        setInventoryId(quotationlessId);
        console.log("quotationlessId "+quotationlessId);

        fetch(url+"api/inventory/"+quotationlessId).then(res => {
            return res.json();
        }).then(res => {
            console.log("response "+res.data);
            let parsed = JSON.parse(res.data);
            setInventory(parsed);
            setProductName(parsed.productName);
            setTotalCasesSold500Month(parsed.totalCasesSold500Month);
            setRemainingCases500(parsed.remainingCases500);
            setTotalCasesSold330Month(parsed.totalCasesSold330Month);
            setRemainingCases330(parsed.remainingCases330);
            setTotalKegsSoldMonth(parsed.totalKegsSoldMonth);
            setRemainingKegs(parsed.remainingKegs);
            setOpeningStock330Cases(parsed.openingStock330Cases);
            setOpeningStock500Cases(parsed.openingStock500Cases);
            setOpeningStockKegs(parsed.openingStockKegs);
            setReceipts500Cases(parsed.receipts500Cases);
            setReceipts330Cases(parsed.receipts330Cases);
            setReceiptsKegs(parsed.receiptsKegs);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getInventory();
    },[]);

    const updateInventory = (e) => {
        e.preventDefault();
        //inventory values to be sent to server
        const inventory = {
            inventoryId: inventoryId,
            productName: productName,
            totalCasesSold500Month: totalCasesSold500Month,
            remainingCases500: remainingCases500,
            totalCasesSold330Month: totalCasesSold330Month,
            remainingCases330: remainingCases330,
            totalKegsSoldMonth: totalKegsSoldMonth,
            remainingKegs: remainingKegs,
            openingStock330Cases: openingStock330Cases,
            openingStock500Cases: openingStock500Cases,
            openingStockKegs: openingStockKegs,
            receipts330Cases: receipts330Cases,
            receipts500Cases: receipts500Cases,
            receiptsKegs: receiptsKegs
        }

          //console.log(inventory)
          const options = { 
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : '*'
            },
               body: JSON.stringify(inventory)   
          }

            //if all data is valid, then post to server
            if(productName && totalCasesSold500Month && remainingCases500 && totalCasesSold330Month && remainingCases330 && totalKegsSoldMonth && remainingKegs && openingStock330Cases && openingStock500Cases && openingStockKegs && receipts330Cases && receipts500Cases && receiptsKegs){
                if(isNaN(parseInt(totalCasesSold500Month)) || isNaN(parseInt(remainingCases500)) || isNaN(parseInt(totalCasesSold330Month)) || isNaN(parseInt(remainingCases330)) || 
                isNaN(parseInt(totalKegsSoldMonth)) || isNaN(parseInt(remainingKegs)) || isNaN(parseInt(openingStock330Cases))|| isNaN(parseInt(openingStock500Cases))  || isNaN(parseInt(openingStockKegs)) || isNaN(parseInt(receipts330Cases)) || isNaN(parseInt(receipts500Cases)) || isNaN(parseInt(receiptsKegs))){
                    setAlertShow(!showAlert);
                    console.log("Invalid form format, will not be sent to database");
                }
                else{
                    fetch(url+"api/updateInventory/"+ inventoryId, options)
                    .then(res => {
                        return res.json();
                    }).then(res => {
                        console.log(res)
                         setRedirect(true);
                    }).catch(err => {
                        console.log(err)
                    });
                }        
        }else{
            setAlertShow(!showAlert);
            console.log("Invalid form format, will not be sent to database");
        }
    }

    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to="/inventory" />  
    }

    const deleteItem = (inventoryId) => {
        const options = { 
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: inventoryId})
          } 
          fetch(url+"api/deleteInventory/"+ inventoryId , options)
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


    const editItem = (inventoryId) => {
        console.log(inventoryId)
        setChangeInventory(!changeInventory);
    }

    let editForm;
    if(changeInventory){
        editForm =
            <React.Fragment>
                <form style={formStyle} onSubmit={updateInventory}>
                        <label>Product Name</label>
                        <input type="text" placeholder="Enter Product Name" onChange= {event => setProductName(event.target.value)} defaultValue={inventory.productName}/>
                    <div style={divStyle} className="float-left">

                        <label>500 Cases Sold this Month</label>
                        <input type="text" placeholder="Enter 500 Cases Sold this Month" onChange={event => setTotalCasesSold500Month(event.target.value)} defaultValue={inventory.totalCasesSold500Month}/>

                        <label>Remaining 500 Cases</label>
                        <input type="text" placeholder="Enter Remaining 500 Cases" onChange={event => setRemainingCases500(event.target.value)} defaultValue={inventory.remainingCases500}/>

                        <label>330 Cases Sold this Month</label>
                        <input type="text" placeholder="Enter 330 Cases Sold this Month" onChange={event => setTotalCasesSold330Month(event.target.value)} defaultValue={inventory.totalCasesSold330Month}/>

                        <label>Remaining 330 Cases</label>
                        <input type="text"  placeholder="Enter Remaining 330 Cases" onChange={event => setRemainingCases330(event.target.value)} defaultValue={inventory.remainingCases330}/>

                        <label>Total Kegs Sold this Month</label>
                        <input type="text" placeholder="Enter Kegs Sold this Month" onChange={event => setTotalKegsSoldMonth(event.target.value)} defaultValue={inventory.totalKegsSoldMonth}/>

                        <label>Remaining Kegs</label>
                        <input type="text"placeholder="Enter Remaining Kegs" onChange={event => setRemainingKegs(event.target.value)} defaultValue={inventory.remainingKegs}/>
                    </div>
                    <div className="float-right" style={divStyle}>           
                        <label>Opening Stock 500ml Cases</label>
                        <input type="text" placeholder="Enter Opening Stock 500ml Cases" onChange={event => setOpeningStock500Cases(event.target.value)} defaultValue={inventory.openingStock500Cases}/>

                        <label>Opening Stock 330ml Cases</label>
                        <input type="text" placeholder="Enter Opening Stock 330ml Cases" onChange={event => setOpeningStock330Cases(event.target.value)} defaultValue={inventory.openingStock330Cases}/>

                        <label>Opening Stock Kegs</label>
                        <input type="text" placeholder="Enter Opening Stock Kegs" onChange={event => setOpeningStockKegs(event.target.value)} defaultValue={inventory.openingStockKegs}/>

                        <label>Receipts 500ml Cases</label>
                        <input type="text" placeholder="Enter Receipts Cases" onChange={event => setReceipts330Cases(event.target.value)} defaultValue={inventory.receipts330Cases}/>

                        <label>Receipts 330ml Cases</label>
                        <input type="text" placeholder="Enter Receipts Cases" onChange={event => setReceipts500Cases(event.target.value)} defaultValue={inventory.receipts500Cases}/>

                        <label>Receipts Kegs</label>
                        <input type="text" placeholder="Enter Receipts Kegs" onChange={event => setReceiptsKegs(event.target.value)} defaultValue={inventory.receiptsKegs}/>
                    </div>
                    <input type="submit" value="Update Inventory"/>
                    {alertFormError}
                </form>        
            </React.Fragment>
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
            <center><Card style={{ width: '40%' }}>
                <Card.Body>
                    <Card.Title>Product Name: {inventory.productName}</Card.Title>
                    <Card.Text>
                        Inventory track for {inventory.productName}
                    </Card.Text>
                </Card.Body>
            </Card></center>
            
            <button className="edit" onClick={(e) => editItem(inventoryId)}>Edit Item</button>
            <button onClick={(e) => deleteItem(inventoryId)}>Delete Item</button>
            {editForm}
        </React.Fragment>)
}
    

export default SingleInventory;