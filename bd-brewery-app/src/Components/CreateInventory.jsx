import React, { useState, useEffect } from 'react';
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
  const CreateInventory = () => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [batchNo, setBatchNo] = useState("");
    const [beer, setBeer] = useState("");
    //const [totalCasesSold500, setTotalCasesSold500] = useState(""); - calculated with formula
    const [totalCasesSold500Month, setTotalCasesSold500Month] = useState("");
    const [remainingCases500, setRemainingCases500] = useState("");
   // const [totalCasesSold330, setTotalCasesSold330] = useState(""); - calculated with formula
    const [totalCasesSold330Month, setTotalCasesSold330Month] = useState("");
    const [remainingCases330, setRemainingCases330] = useState("");
    // const [totalKegsSold, setTotalKegsSold] = useState(""); - calculated with formula
    const [totalKegsSold, setTotalKegsSold] = useState("");
    const [remainingKegs, setRemainingKegs] = useState("");
    const [openingStock330Cases, setOpeningStock330Cases] = useState("");
    const [openingStock500Cases, setOpeningStock500Cases] = useState("");
    const [openingStockKegs, setOpeningStockKegs] = useState("");
    const [openingStockPercentage, setOpeningStockPercentage] = useState("");
    //For redirection after inventory is created
    const [routeRedirect, setRedirect] = useState(false); 
    const [showAlert, setAlertShow] = useState(false);

    // -- more calculations to be done automatically

    const [brews, setbrews] = useState([]);
    const getBrews = () => {
        fetch(url+"api/brew").then(res =>{
          return res.json();
        }).then(brews => {
          console.log(brews);
          setbrews(brews.data);
        }).catch(err => {
          console.log(err);
        })
      }
    
      useEffect(() => {
        getBrews();
      }, [])
    
    
    const create = (event) => {
            event.preventDefault();   

            //brew values to be sent to server
            const inventory = {
                batchNo: batchNo,
                beer: beer,
                totalCasesSold500Month: totalCasesSold500Month,
                remainingCases500: remainingCases500,
                totalCasesSold330Month: totalCasesSold330Month,
                remainingCases330: remainingCases330,
                totalKegsSold: totalKegsSold,
                remainingKegs: remainingKegs,
                openingStock330Cases: openingStock330Cases,
                openingStock500Cases: openingStock500Cases,
                openingStockKegs: openingStockKegs,
                openingStockPercentage: openingStockPercentage
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
            if(batchNo && totalCasesSold500Month && remainingCases500 && totalCasesSold330Month && remainingCases330 && totalKegsSold && remainingKegs && openingStock330Cases && openingStock500Cases && openingStockKegs && openingStockPercentage){
                if(isNaN(parseInt(totalCasesSold500Month)) || isNaN(parseInt(remainingCases500)) || isNaN(parseInt(totalCasesSold330Month)) || isNaN(parseInt(remainingCases330)) || 
                isNaN(parseInt(totalKegsSold)) || isNaN(parseInt(remainingKegs)) || isNaN(parseInt(openingStock330Cases)) || isNaN(parseInt(openingStock500Cases)) || isNaN(parseInt(openingStockKegs)) || isNaN(parseInt(openingStockPercentage))){
                    setAlertShow(!showAlert);
                    console.log("Invalid form format, will not be sent to database");
                }
                else{
                    fetch(url +"api/createinventory", options)
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

    const batchNosList = brews.map((brew) =>
        <option>{brew.batchNo}</option>
    );

    const setUpBrewInfo = (event) => {
        setBatchNo(event.target.value)
        for (var i = 0; i < brews.length; i++) {
            //console.log("dd "+ beerlist[i]);
            if(brews[i].batchNo == event.target.value ){
                console.log(brews[i].beer)
                setBeer(brews[i].beer);
            }
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
                    <label>Batch Number</label>
                    <select onChange={event => setUpBrewInfo(event)}>
                        <option>Select a Batch Number...</option>
                        {batchNosList}
                    </select>
                    <div style={divStyle} className="float-left">

                        <label>500 Cases Sold this Month</label>
                        <input type="text" placeholder="Enter 500 Cases Sold this Month" onChange={event => setTotalCasesSold500Month(event.target.value)}/>

                        <label>Remaining 500 Cases</label>
                        <input type="text" placeholder="Enter Remaining 500 Cases" onChange={event => setRemainingCases500(event.target.value)}/>

                        <label>330 Cases Sold this Month</label>
                        <input type="text" placeholder="Enter 330 Cases Sold this Month" onChange={event => setTotalCasesSold330Month(event.target.value)}/>

                        <label>Remaining 330 Cases</label>
                        <input type="text"  placeholder="Enter Remaining 330 Cases" onChange={event => setRemainingCases330(event.target.value)}/>

                        <label>Total Kegs Sold this Month</label>
                        <input type="text" placeholder="Enter Kegs Sold this Month" onChange={event => setTotalKegsSold(event.target.value)}/>
                    </div>
                    <div className="float-right" style={divStyle}>
                        <label>Remaining Kegs</label>
                        <input type="text"placeholder="Enter Remaining Kegs" onChange={event => setRemainingKegs(event.target.value)}/>

                        <label>Opening Stock 500ml Cases</label>
                        <input type="text" placeholder="Enter Opening Stock 500ml Cases" onChange={event => setOpeningStock330Cases(event.target.value)}/>

                        <label>Opening Stock 330ml Cases</label>
                        <input type="text" placeholder="Enter Opening Stock 330ml Cases" onChange={event => setOpeningStock500Cases(event.target.value)}/>

                        <label>Opening Stock Kegs</label>
                        <input type="text" placeholder="Enter Opening Stock Kegs" onChange={event => setOpeningStockKegs(event.target.value)}/>

                        <label>Opening Stock Percentage</label>
                        <input type="text" placeholder="Enter Opening Stock Percentage" onChange={event => setOpeningStockPercentage(event.target.value)}/>
                    </div>
                    <input type="submit" value="Create Inventory"/>
                    {alertFormError}
                </form>
        </React.Fragment>)
}
    

export default CreateInventory;