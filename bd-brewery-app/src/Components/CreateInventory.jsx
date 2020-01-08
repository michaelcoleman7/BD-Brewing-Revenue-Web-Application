import React, { useState } from 'react';
import { Redirect } from 'react-router';
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
  const CreateInventory = () => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [productName, setProductName] = useState("");
    const [totalLitres, setTotalLitres] = useState("");
    //const [totalCasesSold500, setTotalCasesSold500] = useState(""); - calculated with formula
    const [totalCasesSold500Month, setTotalCasesSold500Month] = useState("");
    const [remainingCases500, setRemainingCases500] = useState("");
   // const [totalCasesSold330, setTotalCasesSold330] = useState(""); - calculated with formula
    const [totalCasesSold330Month, setTotalCasesSold330Month] = useState("");
    const [remainingCases330, setRemainingCases330] = useState("");
    // const [totalKegsSold, setTotalKegsSold] = useState(""); - calculated with formula
    const [totalKegsSold, setTotalKegsSold] = useState("");
    const [remainingKegs, setRemainingKegs] = useState("");
    const [openingStockCases, setOpeningStockCases] = useState("");
    const [openingStockKegs, setOpeningStockKegs] = useState("");
    const [receiptsCases, setReceiptsCases] = useState("");
    const [receiptsKegs, setReceiptsKegs] = useState("");
    //For redirection after inventory is created
    const [routeRedirect, setRedirect] = useState(false); 

    // -- more calculations to be done automatically

    const create = (event) => {
            event.preventDefault();   

            //brew values to be sent to server
            const inventory = {
                productName: productName,
                totalLitres: totalLitres,
                totalCasesSold500Month: totalCasesSold500Month,
                remainingCases500: remainingCases500,
                totalCasesSold330Month: totalCasesSold330Month,
                remainingCases330: remainingCases330,
                totalKegsSold: totalKegsSold,
                remainingKegs: remainingKegs,
                openingStockCases: openingStockCases,
                openingStockKegs: openingStockKegs,
                receiptsCases: receiptsCases,
                receiptsKegs: receiptsKegs
            }

            //options needed to send request to server
            const options = {
                method: "post",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(inventory)
            }

            //if all data is valid, then post to server
            if(productName && totalLitres && totalCasesSold500Month && remainingCases500 && totalCasesSold330Month && remainingCases330 && totalKegsSold && remainingKegs && openingStockCases && openingStockKegs && receiptsCases && receiptsKegs){
                fetch(url +"api/createinventory", options)
                .then(res => {
                    setRedirect(true);
                    return res.json();
                }).catch(err => {
                    console.log(err)
                })

                
            }else{
                console.log("Invalid form format, will not be sent to database");
            }
    }

    // Redirect to inventory page after creation
    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to="/inventory" />  
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
                <form style={formStyle} onSubmit={create}>
                        <label>Product Name</label>
                        <input type="text" placeholder="Enter Product Name" onChange= {event => setProductName(event.target.value)}/>
                    <div style={divStyle} className="float-left">

                        <label>Total Litres</label>
                        <input type="text" placeholder="Enter Total Litres" onChange= {event => setTotalLitres(event.target.value)}/>

                        <label>500 Cases Sold</label>
                        <input type="text" placeholder="Enter 500 Cases Sold" onChange={event => setTotalCasesSold500Month(event.target.value)}/>

                        <label>Remaining 500 Cases</label>
                        <input type="text" placeholder="Enter Remaining 500 Cases" onChange={event => setRemainingCases500(event.target.value)}/>

                        <label>330 Cases Sold</label>
                        <input type="text" placeholder="Enter 330 Cases Sold" onChange={event => setTotalCasesSold330Month(event.target.value)}/>

                        <label>Remaining 330 Cases</label>
                        <input type="text"  placeholder="Enter Remaining 330 Cases" onChange={event => setRemainingCases330(event.target.value)}/>
                    </div>
                    <div className="float-right" style={divStyle}>
                        <label>Total Kegs Sold</label>
                        <input type="text" placeholder="Enter Kegs Sold" onChange={event => setTotalKegsSold(event.target.value)}/>

                        <label>Remaining Kegs</label>
                        <input type="text"placeholder="Enter Remaining Kegs" onChange={event => setRemainingKegs(event.target.value)}/>

                        <label>Opening Stock Cases</label>
                        <input type="text" placeholder="Enter Opening Stock Cases" onChange={event => setOpeningStockCases(event.target.value)}/>

                        <label>Opening Stock Kegs</label>
                        <input type="text" placeholder="Enter Opening Stock Kegs" onChange={event => setOpeningStockKegs(event.target.value)}/>

                        <label>Receipts Cases</label>
                        <input type="text" placeholder="Enter Receipts Cases" onChange={event => setReceiptsCases(event.target.value)}/>

                        <label>Receipts Kegs</label>
                        <input type="text" placeholder="Enter Receipts Kegs" onChange={event => setReceiptsKegs(event.target.value)}/>
                    </div>
                    <input type="submit" value="Create Inventory"/>
                </form>
        </React.Fragment>)
}
    

export default CreateInventory;