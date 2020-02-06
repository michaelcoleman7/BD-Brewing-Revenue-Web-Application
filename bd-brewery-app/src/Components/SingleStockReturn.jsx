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

    const [routeRedirect, setRedirect] = useState(""); 
    const [showAlert, setAlertShow] = useState(false);

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
            console.log("response "+res.data);
            let parsed = JSON.parse(res.data);
            setStockReturn(parsed);
            setBeer(parsed.beer);
            setOpeningStock330Cases(parsed.openingStock330Cases);
            console.log("330 "+ parsed)
            setOpeningStock500Cases(parsed.openingStock500Cases);
            setOpeningStockKegs(parsed.openingStockKegs);
            setReceipts330Cases(parsed.receipts330Cases);
            setReceipts500Cases(parsed.receipts500Cases);
            setReceiptsKegs(parsed.receiptsKegs);
            setDeliveries330Cases(parsed.deliveries330Cases);
            setDeliveries500Cases(parsed.deliveries500Cases);
            setDeliveriesKegs(parsed.deliveriesKegs);
            setClosingStock330Cases(parsed.closingStock330Cases);
            setClosingStock500Cases(parsed.closingStock500Cases);
            setClosingStockKegs(parsed.closingStockKegs);

            setOS_HL(parsed.OS_HL);
            setReceipts_HL(parsed.receipts_HL);   
            setDeliveries_HL(parsed.deliveries_HL);    
            setCS_HL(parsed.CS_HL);   
            
            setOSPercentage(parsed.openingStockPercentage);
            setReceiptsPercentage(parsed.receiptsPercentage);   
            setDeliveriesPercentage(parsed.deliveriesPercentage);    
            setCSPercentage(parsed.ClosingStockPercentage); 

            setOS_HLPercent(parsed.OS_HLPercent);
            setReceipts_HLPercent(parsed.receipts_HLPercent);   
            setDeliveries_HLPercent(parsed.Deliveries_HLPercent);    
            setCS_HLPercent(parsed.CS_HLPercent); 

            
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

    let redirectRoute = "/stockreturnlist/"
    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to={redirectRoute}/>  
    }

    const deleteItem = (stockReturnId) => {
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
            </tbody>
            </Table>
        </React.Fragment>)
}
    

export default SingleStockReturn;