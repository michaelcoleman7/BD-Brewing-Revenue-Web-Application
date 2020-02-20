import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card'
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import '../Stylesheets/Form.css';
import ReactToPrint from "react-to-print";

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
    const [batchNo, setBatchNo] = useState("");
    const [beer, setBeer] = useState("");
    const [inventoryId, setInventoryId] = useState("");
    const [inventory, setInventory] = useState("");
    const [totalsInventory, setTotalsInventory] = useState("");
    const [changeInventory, setChangeInventory] = useState(false); 

    const [totalLitres, setTotalLitres] = useState("");
    const [totalCasesSold500Month, setTotalCasesSold500Month] = useState("");
    const [remainingCases500, setRemainingCases500] = useState("");
    const [totalCasesSold330Month, setTotalCasesSold330Month] = useState("");
    const [remainingCases330, setRemainingCases330] = useState("");
    const [totalKegsSoldMonth, setTotalKegsSoldMonth] = useState("");
    const [remainingKegs, setRemainingKegs] = useState("");
    const [openingStock330Cases, setOpeningStock330Cases] = useState("");
    const [openingStock500Cases, setOpeningStock500Cases] = useState("");
    const [openingStockKegs, setOpeningStockKegs] = useState("");
    const [openingStockPercentage, setOpeningStockPercentage] = useState("");
    const [routeRedirect, setRedirect] = useState(""); 
    const [showAlert, setAlertShow] = useState(false);

    const getInventory = () => {
        let id = props.match.params.id;

        // Remove all the "" from the id - 
        //Note: Adding the /g will mean that all of the matching values are replaced,
        //otherwise just 1st occurance removed- https://stackoverflow.com/questions/1206911/why-do-i-need-to-add-g-when-using-string-replace-in-javascript
        let quotationlessId = id.replace(/['"]+/g, "");     

        setInventoryId(quotationlessId);

        fetch(url+"api/inventory/"+quotationlessId).then(res => {
            return res.json();
        }).then(res => {
            //console.log("response "+res.data);
            let parsed = JSON.parse(res.data);
            setBeer(props)
            setInventory(parsed);
            setTotalsInventory(parsed.totalsInventory)
            setBatchNo(parsed.batchNo);
            setTotalLitres(parsed.totalLitres)
            setTotalCasesSold500Month(parsed.totalCasesSold500Month);
            setRemainingCases500(parsed.remainingCases500);
            setTotalCasesSold330Month(parsed.totalCasesSold330Month);
            setRemainingCases330(parsed.remainingCases330);
            setTotalKegsSoldMonth(parsed.totalKegsSoldMonth);
            setRemainingKegs(parsed.remainingKegs);
            setOpeningStock330Cases(parsed.openingStock330Cases);
            setOpeningStock500Cases(parsed.openingStock500Cases);
            setOpeningStockKegs(parsed.openingStockKegs);
            setOpeningStockPercentage(parsed.openingStockPercentage);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getInventory();
    },[]);

    const [brews, setbrews] = useState([]);
    const getBrews = () => {
        fetch(url+"api/brew").then(res =>{
          return res.json();
        }).then(brews => {
          setbrews(brews.data);
        }).catch(err => {
          console.log(err);
        })
      }
    
      useEffect(() => {
        getBrews();
      }, [])

    const updateInventory = (e) => {
        e.preventDefault();
        //inventory values to be sent to server
        const inventory = {
            inventoryId: inventoryId,
            batchNo: batchNo,
            beer: beer,
            totalCasesSold500Month: totalCasesSold500Month,
            remainingCases500: remainingCases500,
            totalCasesSold330Month: totalCasesSold330Month,
            remainingCases330: remainingCases330,
            totalKegsSoldMonth: totalKegsSoldMonth,
            remainingKegs: remainingKegs,
            openingStock330Cases: openingStock330Cases,
            openingStock500Cases: openingStock500Cases,
            openingStockKegs: openingStockKegs,
            openingStockPercentage: openingStockPercentage
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
            if(batchNo && totalCasesSold500Month && remainingCases500 && totalCasesSold330Month && remainingCases330 && totalKegsSoldMonth && remainingKegs && openingStock330Cases && openingStock500Cases && openingStockKegs && openingStockPercentage){
                if(isNaN(parseInt(totalCasesSold500Month)) || isNaN(parseInt(remainingCases500)) || isNaN(parseInt(totalCasesSold330Month)) || isNaN(parseInt(remainingCases330)) || 
                isNaN(parseInt(totalKegsSoldMonth)) || isNaN(parseInt(remainingKegs)) || isNaN(parseInt(openingStock330Cases))|| isNaN(parseInt(openingStock500Cases))  || isNaN(parseInt(openingStockKegs))|| isNaN(parseInt(openingStockPercentage))){
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
    let redirectRoute = "/"
    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to={redirectRoute} />  
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
        setBeersInfo();
    }

    const batchNosList = brews.map((brew) =>
        <option>{brew.batchNo}</option>
    );

    const setUpBrewInfo = (event) => {
        setBatchNo(event.target.value)
        for (var i = 0; i < brews.length; i++) {
            if(brews[i].batchNo == event.target.value ){
                setBeer(brews[i].beer);
            }
        }   
    }

    const setBeersInfo = () =>{
        for (var i = 0; i < brews.length; i++) {
            if(brews[i].batchNo == batchNo ){
                setBeer(brews[i].beer);
            }
        }   
    }
    


    let editForm;
    if(changeInventory){
        editForm =
            <React.Fragment>
                <form style={formStyle} onSubmit={updateInventory}>
                        <label>Batch Number</label>
                    <select onChange={event => setUpBrewInfo(event)}>
                        <option>{inventory.batchNo}</option>
                        {batchNosList}
                    </select>
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
                    </div>
                    <div className="float-right" style={divStyle}>
                        <label>Remaining Kegs</label>
                        <input type="text"placeholder="Enter Remaining Kegs" onChange={event => setRemainingKegs(event.target.value)} defaultValue={inventory.remainingKegs}/>           
                        
                        <label>Opening Stock 500ml Cases</label>
                        <input type="text" placeholder="Enter Opening Stock 500ml Cases" onChange={event => setOpeningStock500Cases(event.target.value)} defaultValue={inventory.openingStock500Cases}/>

                        <label>Opening Stock 330ml Cases</label>
                        <input type="text" placeholder="Enter Opening Stock 330ml Cases" onChange={event => setOpeningStock330Cases(event.target.value)} defaultValue={inventory.openingStock330Cases}/>

                        <label>Opening Stock Kegs</label>
                        <input type="text" placeholder="Enter Opening Stock Kegs" onChange={event => setOpeningStockKegs(event.target.value)} defaultValue={inventory.openingStockKegs}/>

                        <label>Opening Stock Percentage</label>
                        <input type="text" placeholder="Enter Opening Stock Percentage" onChange={event => setOpeningStockPercentage(event.target.value)} defaultValue={inventory.openingStockPercentage}/>
                    </div>
                    <input type="submit" value="Update Inventory"/>
                    {alertFormError}
                </form>        
            </React.Fragment>
    }

       //adapted from - https://www.npmjs.com/package/react-to-print
       class InventoryInformation extends React.Component {
        render() {
          return (
            <center><Card style={{ width: '85%'}}>
                <Card.Body>
                    <Card.Title><h3><b>Inventory: {inventory.beer} - {inventory.batchNo}</b></h3></Card.Title>
                    <Card.Text>
                    <b>Batch Number:</b> {inventory.batchNo}<br/>
                    <b>Beer:</b> {inventory.beer}<br/>
                    <b>Total Litres:</b> {inventory.totalLitres}<br/>
                    <b>Total Cases Sold (500ml):</b> {inventory.totalCasesSold500}<br/>
                    <b>Cases Sold This Month (500ml):</b> {inventory.totalCasesSold500Month}<br/>
                    <b>Remaining Cases: (500ml)</b> {inventory.remainingCases500}<br/>
                    <b>Total Cases Sold (330ml):</b> {inventory.totalCasesSold330}<br/>
                    <b>Cases Sold This Month (330ml):</b> {inventory.totalCasesSold330Month}<br/>
                    <b>Remaining Cases: (330ml)</b> {inventory.remainingCases330}<br/>
                    <b>Total Kegs Sold:</b> {inventory.totalKegsSold}<br/>
                    <b>Kegs Sold This Month:</b> {inventory.totalKegsSoldMonth}<br/>
                    <b>Remaining Kegs:</b> {inventory.remainingKegs}<br/>

                    <b>Opening Stock Cases (330ml):</b> {openingStock330Cases}<br/>
                    <b>Opening Stock Cases (500ml):</b> {openingStock500Cases}<br/>
                    <b>Opening Stock Kegs:</b> {openingStockKegs}<br/>
                    <b>Opening Stock Percentage:</b> {openingStockPercentage}<br/>

                    <b>Receipts Average %:</b> {inventory.receiptsAvg}<br/>
                    <b>Sold Month Average %:</b> {inventory.soldAvgMonth}<br/>
                    <b>Remaining Average %:</b> {inventory.AvgRemaining}<br/><br/><br/>

                    <b><h3>Totals by Beer for all of: {inventory.beer}</h3></b> <br/><br/>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Total Monthly Cases (500ml) Sold</th>
                                <td>{totalsInventory.totalMonthlyCases500Sold}</td>
                                <th>Total Cases (500ml) Sold</th>
                                <td>{totalsInventory.total500CasesSold}</td>
                                <th>Total Remaining Cases (500ml)</th>
                                <td>{totalsInventory.totalRemainingCases500}</td>
                                <th>Total Monthly Cases (500ml) Sold Total Litres</th>
                                <td>{totalsInventory.totalMonthlyCases500SoldTL}</td>
                                <th>Total Cases (500ml) Sold Total Litres</th>
                                <td>{totalsInventory.total500CasesSoldTL}</td>
                                <th>Total Remaining Cases (500ml) Total Litres</th>
                                <td>{totalsInventory.totalRemainingCases500TL}</td>
                            </tr>

                            <tr>
                                <th>Total Monthly Cases (330ml) Sold</th>
                                <td>{totalsInventory.totalMonthlyCases330Sold}</td>
                                <th>Total Cases (330ml) Sold</th>
                                <td>{totalsInventory.total330CasesSold}</td>
                                <th>Total Remaining Cases (330ml)</th>
                                <td>{totalsInventory.totalRemainingCases330}</td>
                                <th>Total Monthly Cases (330ml) Sold Total Litres</th>
                                <td>{totalsInventory.totalMonthlyCases330SoldTL}</td>
                                <th>Total Cases (330ml) Sold Total Litres</th>
                                <td>{totalsInventory.total330CasesSoldTL}</td>
                                <th>Total Remaining Cases (330ml) Total Litres</th>
                                <td>{totalsInventory.totalRemainingCases330TL}</td>
                            </tr>

                            <tr>
                                <th>Total Monthly Kegs Sold</th>
                                <td>{totalsInventory.totalMonthlyKegsSold}</td>
                                <th>Total Kegs Sold</th>
                                <td>{totalsInventory.totalInvKegsSold}</td>
                                <th>Total Remaining Kegs</th>
                                <td>{totalsInventory.totalRemainingKegs}</td>
                                <th>Total Monthly Kegs Total Litres</th>
                                <td>{totalsInventory.totalMonthlyKegsSoldTL}</td>
                                <th>Total Kegs Sold Total Litres</th>
                                <td>{totalsInventory.totalInvKegsSoldTL}</td>
                                <th>Total Remaining Kegs Total Litres</th>
                                <td>{totalsInventory.totalRemainingKegsTL}</td>
                            </tr>

                            <tr>
                                <th>Totals of Receipts Averages</th>
                                <td>{totalsInventory.totalReceiptsAvg}</td>
                                <th>Totals of Monthly Sold Averages</th>
                                <td>{totalsInventory.totalSoldMonthAvg}</td>
                                <th>Totals of Remaining Averages</th>
                                <td>{totalsInventory.totalAvgRemaining}</td>
                                <th>Receipts Average New Percentage</th>
                                <td>{totalsInventory.receiptsAvgNewPercentage}%</td>
                                <th>Sold Month Average New Percentage</th>
                                <td>{totalsInventory.soldMonthAvgNewPercentage}%</td>
                                <th>Remains Average New Percentage</th>
                                <td>{totalsInventory.remainsAvgNewPercentage}%</td>
                            </tr>

                            <tr>
                                <th>Total Litres sold for Beer</th>
                                <td colSpan="5"> {totalsInventory.litresSold}</td>
                                <th>Totals HectoLitres Sold</th>
                                <td colSpan="5">{totalsInventory.HLSold}</td>
                            </tr>
                        </tbody>
                    </Table>
                    </Card.Text>
                </Card.Body>
            </Card></center>
          );
        }
      }    
    class InventoryDisplay extends React.Component {
        render() {
        return (
            <div>
            <InventoryInformation ref={el => (this.componentRef = el)} />
            <ReactToPrint
                trigger={() => <button href="#">Print Inventory</button>}
                content={() => this.componentRef}
            />
            </div>
        );
        }
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
            <InventoryDisplay/> 
            <button className="edit" onClick={(e) => editItem(inventoryId)}>Edit Inventory</button>
            <button onClick={(e) => deleteItem(inventoryId)}>Delete Inventory</button>
            {editForm}
        </React.Fragment>)
}
    

export default SingleInventory;