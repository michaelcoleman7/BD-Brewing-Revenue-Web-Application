import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card'
import { Redirect } from 'react-router';
import Table from 'react-bootstrap/Table'
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
  const SingleStockReturn = (props) => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [batchNo, setBatchNo] = useState("");
    const [beer, setBeer] = useState("");
    const [makeChanges, setMakeChanges] = useState("");
    const [otherBreweryCheckRec, setOtherBreweryCheckRec] = useState("");
    const [otherCountryCheckRec, setOtherCountryCheckRec] = useState("");
    const [otherBreweryCheckDel, setOtherBreweryCheckDel] = useState("");
    const [otherCountryCheckDel, setOtherCountryCheckDel] = useState("");
    const [stockReturnId, setStockReturnId] = useState("");
    const [stockReturn, setStockReturn] = useState("");
    const [changeInventory, setChangeInventory] = useState(false); 

    const [openingStock330Cases, setOpeningStock330Cases] = useState("");
    const [openingStock500Cases, setOpeningStock500Cases] = useState("");
    const [openingStockKegs, setOpeningStockKegs] = useState("");
    const [receipts330Cases, setReceipts330Cases] = useState("");
    const [receipts500Cases, setReceipts500Cases] = useState("");
    const [receiptsKegs, setReceiptsKegs] = useState("");
    const [deliveries330Cases, setDeliveries330Cases] = useState("");
    const [deliveries500Cases, setDeliveries500Cases] = useState("");
    const [deliveriesKegs, setDeliveriesKegs] = useState("");
    const [closingStock330Cases, setClosingStock330Cases] = useState("");
    const [closingStock500Cases, setClosingStock500Cases] = useState("");
    const [closingStockKegs, setClosingStockKegs] = useState("");

    const [oS_HL, setOS_HL] = useState("");
    const [receipts_HL, setReceipts_HL] = useState("");
    const [deliveries_HL, setDeliveries_HL] = useState("");
    const [cS_HL, setCS_HL] = useState("");

    const [oSPercentage, setOSPercentage] = useState("");
    const [receiptsPercentage, setReceiptsPercentage] = useState("");
    const [deliveriesPercentage, setDeliveriesPercentage] = useState("");
    const [cSPercentage, setCSPercentage] = useState("");

    const [oS_HLPercent, setOS_HLPercent] = useState("");
    const [receipts_HLPercent, setReceipts_HLPercent] = useState("");
    const [deliveries_HLPercent, setDeliveries_HLPercent] = useState("");
    const [cS_HLPercent, setCS_HLPercent] = useState("");

    const [totalHlPercent, setTotalHlPercent] = useState("");
    const [totalDuty, setTotalDuty] = useState("");

    const [routeRedirect, setRedirect] = useState(""); 

    const getStockReturn = () => {
        let id = props.match.params.id;

        // Remove all the "" from the id - 
        //Note: Adding the /g will mean that all of the matching values are replaced,
        //otherwise just 1st occurance removed- https://stackoverflow.com/questions/1206911/why-do-i-need-to-add-g-when-using-string-replace-in-javascript
        let quotationlessId = id.replace(/['"]+/g, "");     

        setStockReturnId(quotationlessId);

        fetch(url+"api/stockreturn/"+quotationlessId).then(res => {
            return res.json();
        }).then(res => {
            let parsed = JSON.parse(res.data);
            setStockReturn(parsed);
            setBeer(parsed.beer);
            setOpeningStock330Cases(parsed.totalsInventory.openingStock330Cases);
            setOpeningStock500Cases(parsed.totalsInventory.openingStock500Cases);
            setOpeningStockKegs(parsed.totalsInventory.openingStockKegs);
            setReceipts330Cases(parsed.totalsInventory.recieptsCases330);
            setReceipts500Cases(parsed.totalsInventory.recieptsCases500);
            setReceiptsKegs(parsed.totalsInventory.recieptsKegs);
            setDeliveries330Cases(parsed.totalsInventory.deliveries330Cases);
            setDeliveries500Cases(parsed.totalsInventory.deliveries500Cases);
            setDeliveriesKegs(parsed.totalsInventory.deliveriesKegs);
            setClosingStock330Cases(parsed.totalsInventory.closingStockCases330);
            setClosingStock500Cases(parsed.totalsInventory.closingStockCases500);
            setClosingStockKegs(parsed.totalsInventory.closingStockKegs);

            setOS_HL(parsed.totalsInventory.OS_HL);
            setReceipts_HL(parsed.totalsInventory.receipts_HL);   
            setDeliveries_HL(parsed.totalsInventory.deliveries_HL);    
            setCS_HL(parsed.totalsInventory.CS_HL);   
            
            setOSPercentage(parsed.totalsInventory.openingStockPercentage);
            setReceiptsPercentage(parsed.totalsInventory.receiptsPercentage);   
            setDeliveriesPercentage(parsed.totalsInventory.deliveriesPercentage);    
            setCSPercentage(parsed.totalsInventory.ClosingStockPercentage); 

            setOS_HLPercent(parsed.totalsInventory.OS_HLPercent);
            setReceipts_HLPercent(parsed.totalsInventory.receipts_HLPercent);   
            setDeliveries_HLPercent(parsed.totalsInventory.Deliveries_HLPercent);    
            setCS_HLPercent(parsed.totalsInventory.CS_HLPercent); 

            setOtherBreweryCheckRec(parsed.otherBreweryCheckRec);
            setOtherCountryCheckRec(parsed.otherCountryCheckRec);
            setOtherBreweryCheckDel(parsed.otherBreweryCheckDel);
            setOtherCountryCheckDel(parsed.otherCountryCheckDel);

            setTotalHlPercent(parsed.totalHLPercent);
            setTotalDuty(parsed.totalDutyOwed);
            console.log(parsed.totalHLPercent);

            setMakeChanges(true);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getStockReturn();
    },[]);

    const updateInventory = (e) => {
        // DO A REFRESH OF A TOTALS HERE ---------------------------------------------------------
    }

    if(makeChanges){
        //set up reciepts columns
        if(otherBreweryCheckRec == false && otherCountryCheckRec == false){
            var elems = document.getElementsByClassName("kdmRec");
            elems[0].innerHTML = receipts330Cases;
            elems[1].innerHTML = receipts500Cases;
            elems[2].innerHTML = receiptsKegs;
            elems[3].innerHTML = receipts_HL;
            elems[4].innerHTML = receiptsPercentage;
            elems[5].innerHTML = receipts_HLPercent;
        }
        else if(otherBreweryCheckRec == true && otherCountryCheckRec == false){
            var elems = document.getElementsByClassName("warehouseRec");
            elems[0].innerHTML = receipts330Cases;
            elems[1].innerHTML = receipts500Cases;
            elems[2].innerHTML = receiptsKegs;
            elems[3].innerHTML = receipts_HL;
            elems[4].innerHTML = receiptsPercentage;
            elems[5].innerHTML = receipts_HLPercent;
        }
        else if(otherBreweryCheckRec == false && otherCountryCheckRec == true){
            var elems = document.getElementsByClassName("countryRec");
            elems[0].innerHTML = receipts330Cases;
            elems[1].innerHTML = receipts500Cases;
            elems[2].innerHTML = receiptsKegs;
            elems[3].innerHTML = receipts_HL;
            elems[4].innerHTML = receiptsPercentage;
            elems[5].innerHTML = receipts_HLPercent;
        }

        //set up delveries columns
        if(otherBreweryCheckDel == false && otherCountryCheckDel == false){
            var elems = document.getElementsByClassName("kdmDel");
            elems[0].innerHTML = deliveries330Cases;
            elems[1].innerHTML = deliveries500Cases;
            elems[2].innerHTML = deliveriesKegs;
            elems[3].innerHTML = deliveries_HL;
            elems[4].innerHTML = deliveriesPercentage;
            elems[5].innerHTML = deliveries_HLPercent;
        }
        else if(otherBreweryCheckDel == true && otherCountryCheckDel == false){
            var elems = document.getElementsByClassName("warehouseDel");
            elems[0].innerHTML = deliveries330Cases;
            elems[1].innerHTML = deliveries500Cases;
            elems[2].innerHTML = deliveriesKegs;
            elems[3].innerHTML = deliveries_HL;
            elems[4].innerHTML = deliveriesPercentage;
            elems[5].innerHTML = deliveries_HLPercent;
        }
        else if(otherBreweryCheckDel == false && otherCountryCheckDel == true){
            var elems = document.getElementsByClassName("countryDel");
            elems[0].innerHTML = deliveries330Cases;
            elems[1].innerHTML = deliveries500Cases;
            elems[2].innerHTML = deliveriesKegs;
            elems[3].innerHTML = deliveries_HL;
            elems[4].innerHTML = deliveriesPercentage;
            elems[5].innerHTML = deliveries_HLPercent;
        }
        //set up totals - according to stock return sheets
        var elems = document.getElementsByClassName("totDel");
        elems[0].innerHTML = deliveries330Cases;
        elems[1].innerHTML = deliveries500Cases;
        elems[2].innerHTML = deliveriesKegs;
        elems[3].innerHTML = deliveries_HL;
        elems[4].innerHTML = deliveriesPercentage;
        elems[5].innerHTML = deliveries_HLPercent;
        var elems = document.getElementsByClassName("totRec");
        elems[0].innerHTML = receipts330Cases;
        elems[1].innerHTML = receipts500Cases;
        elems[2].innerHTML = receiptsKegs;
        elems[3].innerHTML = receipts_HL;
        elems[4].innerHTML = receiptsPercentage;
        elems[5].innerHTML = receipts_HLPercent;
    }

    let redirectRoute = "/stockreturnlist/"
    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to={redirectRoute}/>  
    }

    const deleteStockReturn = (stockReturnId) => {
        const options = { 
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: stockReturnId})
        } 
          fetch(url+"api/deletestockreturn/"+ stockReturnId , options)
          .then(res => {
            return res.json()
           })
           .then(res => {
               setRedirect(true);
           }).catch(err => {
               console.log(err)
           })
    }
    

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
            <center><Card style={{ width: '75%' }}>
                <Card.Body>
                    <Card.Title><b>Stock Return For:</b>  {stockReturn.beer}</Card.Title>
                    <Card.Text>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th></th>
                            <th>Cases of Bottles 330</th>
                            <th>Cases of Bottles 500</th>
                            <th>Number of Kegs</th>
                            <th>Quantity (HLs)</th>
                            <th>%Vol</th>
                            <th>Hectolitre %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Opening Stock</td>
                                <th>{openingStock330Cases}</th>
                                <th>{openingStock500Cases}</th>
                                <th>{openingStockKegs}</th>
                                <th>{oS_HL}</th>
                                <th>{oSPercentage}</th>
                                <th>{oS_HLPercent}</th>
                            </tr>
                            <tr>
                                <td>Add Reciepts</td>
                                <th>{receipts330Cases}</th>
                                <th>{receipts500Cases}</th>
                                <th>{receiptsKegs}</th>
                                <th>{receipts_HL}</th>
                                <th>{receiptsPercentage}</th>
                                <th>{receipts_HLPercent}</th>
                            </tr>
                            <tr>
                                <td>Less Deliveries</td>
                                <th>{deliveries330Cases}</th>
                                <th>{deliveries500Cases}</th>
                                <th>{deliveriesKegs}</th>
                                <th>{deliveries_HL}</th>
                                <th>{deliveriesPercentage}</th>
                                <th>{deliveries_HLPercent}</th>
                            </tr>
                            <tr>
                                <td>Closing Stock</td>
                                <th>{closingStock330Cases}</th>
                                <th>{closingStock500Cases}</th>
                                <th>{closingStockKegs}</th>
                                <th>{cS_HL}</th>
                                <th>{cSPercentage}</th>
                                <th>{cS_HLPercent}</th>
                            </tr>

                            <tr>
                                <td></td>
                                <th colSpan="6" height="25"></th>
                            </tr>

                            <tr>
                                <td colSpan="6" ><b>Receipts:</b></td>
                                <th></th>
                            </tr>

                            <tr>
                                <td></td>
                                <th colSpan="6" height="25"></th>
                            </tr>

                            <tr>
                                <td>Kegged/Bottled During Month</td>
                                <th class="kdmRec"></th>
                                <th class="kdmRec"></th>
                                <th class="kdmRec"></th>
                                <th class="kdmRec"></th>
                                <th class="kdmRec"></th>
                                <th class="kdmRec"></th>
                            </tr>

                            <tr>
                                <td>Received from other warehouses</td>
                                <th class="warehouseRec"></th>
                                <th class="warehouseRec"></th>
                                <th class="warehouseRec"></th>
                                <th class="warehouseRec"></th>
                                <th class="warehouseRec"></th>
                                <th class="warehouseRec"></th>
                            </tr>

                            <tr>
                                <td>Received from Import</td>
                                <th class="countryRec"></th>
                                <th class="countryRec"></th>
                                <th class="countryRec"></th>
                                <th class="countryRec"></th>
                                <th class="countryRec"></th>
                                <th class="countryRec"></th>
                            </tr>

                            <tr>
                                <td><b>Total Receipts</b></td>
                                <th class="totRec"></th>
                                <th class="totRec"></th>
                                <th class="totRec"></th>
                                <th class="totRec"></th>
                                <th class="totRec"></th>
                                <th class="totRec"></th>
                            </tr>

                            <tr>
                                <td></td>
                                <th colSpan="6" height="25"></th>
                            </tr>

                            <tr>
                                <td colSpan="6" ><b>Deliveries:</b></td>
                                <th></th>
                            </tr>

                            <tr>
                                <td></td>
                                <th colSpan="6" height="25"></th>
                            </tr>

                            <tr>
                                <td>Delivered for Home Consumption</td>
                                <th class="kdmDel"></th>
                                <th class="kdmDel"></th>
                                <th class="kdmDel"></th>
                                <th class="kdmDel"></th>
                                <th class="kdmDel"></th>
                                <th class="kdmDel"></th>
                            </tr>

                            <tr>
                                <td>Delivered to other Warehouses</td>
                                <th class="warehouseDel"></th>
                                <th class="warehouseDel"></th>
                                <th class="warehouseDel"></th>
                                <th class="warehouseDel"></th>
                                <th class="warehouseDel"></th>
                                <th class="warehouseDel"></th>
                            </tr>

                            <tr>
                                <td>Delivered for Export</td>
                                <th class="countryDel"></th>
                                <th class="countryDel"></th>
                                <th class="countryDel"></th>
                                <th class="countryDel"></th>
                                <th class="countryDel"></th>
                                <th class="countryDel"></th>
                            </tr>

                            <tr>
                                <td><b>Total Deliveries</b></td>
                                <th class="totDel"></th>
                                <th class="totDel"></th>
                                <th class="totDel"></th>
                                <th class="totDel"></th>
                                <th class="totDel"></th>
                                <th class="totDel"></th>
                            </tr>
                        </tbody>
                        </Table>
                    </Card.Text>
                    <br/><h3>Totals for All Stock Returns</h3><br/>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td><b>Total HL across all stock returns:</b></td>
                                <th>{totalHlPercent}%</th>
                            </tr>
                            <tr>
                                <td><b>Total Duty across all stock returns:</b></td>
                                <th>€{totalDuty}</th>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card></center>

            <button onClick={(e) => deleteStockReturn(stockReturnId)}>Delete Stock Return</button>
        </React.Fragment>)
}
    

export default SingleStockReturn;