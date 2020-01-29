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

  // react arrow function component to create a brew
  const SingleBrew = (props) => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [productName, setProductName] = useState("");
    const [brewId, setBrewId] = useState("");
    const [brew, setBrew] = useState("");
    const [changeBrew, setChangeBrew] = useState(false); 
    const [beer, setBeer] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [brewDate, setBrewDate] = useState("");
    const [og, setOG] = useState("");
    const [pg, setPG] = useState("");
    //OG-PG is a also a variable, calculate using above values
    const [postConditionDate, setPCD] = useState("");
    const [kegNo, setKegNo] = useState("");
    const [bottleNo500, setBottleNo500] = useState("");
    const [bottleNo330, setBottleNo330] = useState("");
    const [status, setStatus] = useState("");
    const [packaged, setPackaged] = useState("");
    const [routeRedirect, setRedirect] = useState(""); 
    const [showAlert, setAlertShow] = useState(false);
    

    const getBrew = () => {
        let id = props.match.params.id;

        // Remove all the "" from the id - 
        //Note: Adding the /g will mean that all of the matching values are replaced,
        //otherwise just 1st occurance removed- https://stackoverflow.com/questions/1206911/why-do-i-need-to-add-g-when-using-string-replace-in-javascript
        let quotationlessId = id.replace(/['"]+/g, "");     

        setBrewId(quotationlessId);
        console.log("quotationlessId "+quotationlessId);

        fetch(url+"api/brew/"+quotationlessId).then(res => {
            return res.json();
        }).then(res => {
            console.log("response "+res.data);
            let parsed = JSON.parse(res.data);
            setBrew(parsed);
            setProductName(parsed.productName);
            setBeer(parsed.beer);
            setBatchNo(parsed.batchNo);
            setBrewDate(parsed.brewDate);
            setOG(parsed.og);
            setPG(parsed.pg);
            setPCD(parsed.postConditionDate);
            setKegNo(parsed.kegNo);
            setBottleNo500(parsed.bottleNo500);
            setBottleNo330(parsed.bottleNo330);
            setStatus(parsed.status);
            setPackaged(parsed.packaged);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getBrew();
    },[]);

    const updateBrew = (e) => {
        e.preventDefault();
            //brew values to be sent to server
            const brew = {
                brewId: brewId,
                productName: productName,
                beer: beer,
                batchNo: batchNo,
                brewDate: brewDate,
                og: og,
                pg: pg,
                postConditionDate: postConditionDate,
                kegNo: kegNo,
                bottleNo500: bottleNo500,
                bottleNo330: bottleNo330,
                status: status,
                packaged: packaged
            }

          //console.log(brew)
          const options = { 
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : '*'
            },
               body: JSON.stringify(brew)   
          }
                      //if all data is valid, then post to server
                      if(productName && beer && batchNo && brewDate && og && pg && postConditionDate && kegNo && bottleNo500 && bottleNo330 && status){
                        if(isNaN(parseFloat(og).toFixed(5)) || isNaN(parseFloat(pg).toFixed(5)) || isNaN(parseInt(kegNo)) || isNaN(parseInt(bottleNo500)) || isNaN(parseInt(bottleNo330))){
                            setAlertShow(!showAlert);
                            console.log("Invalid form format, will not be sent to database");
                        }
                        else{
                            fetch(url+"api/updateBrew/"+ brewId, options)
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

    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to="/brew" />  
    }

    const deleteItem = (brewId) => {
        const options = { 
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: brewId})
          } 
          fetch(url+"api/deleteBrew/"+ brewId , options)
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

    const editItem = (brewId) => {
        console.log(brewId);
        setChangeBrew(!changeBrew);
    }


    let editForm;
    if(changeBrew){
        editForm =
            <React.Fragment>
                <form style={formStyle} onSubmit={updateBrew}>
                        <label>Product Name</label>
                        <input type="text" name="ProductName" placeholder="Enter Product Name" onChange= {event => setProductName(event.target.value)} defaultValue={brew.productName}/>
                    <div style={divStyle} className="float-left">

                        <label>Beer</label>
                        <input type="text" name="beer" placeholder="Enter Beer" onChange={event => setBeer(event.target.value)} defaultValue={brew.beer}/>

                        <label>Batch No</label>
                        <input type="text" name="batchNo" placeholder="Enter Batch Number" onChange={event => setBatchNo(event.target.value)} defaultValue={brew.batchNo}/>

                        <label>Brew Date</label>
                        <input type="text" name="brewDate" placeholder="Enter Brew Date" onChange={event => setBrewDate(event.target.value)} defaultValue={brew.brewDate}/>

                        <label>OG (Original Gravity)</label>
                        <input type="text" name="og" placeholder="Enter OG" onChange={event => setOG(event.target.value)} defaultValue={brew.og}/>

                        <label>PG (Present Gravity)</label>
                        <input type="text" name="pg" placeholder="Enter PG" onChange={event => setPG(event.target.value)} defaultValue={brew.pg}/>

                        <input type="checkbox" name="brewpackaged" value="true" checked = {packaged} onChange={(e) => setPackaged(!packaged)} /> Packaged <br/>
                    </div>
                    <div className="float-right" style={divStyle}>
                        <label>Post Conditioning Date</label>
                        <input type="text" name="postConditionDate" placeholder="Enter Post Conditioning Date" onChange={event => setPCD(event.target.value)} defaultValue={brew.postConditionDate}/>

                        <label>Keg No</label>
                        <input type="text" name="kegNo" placeholder="Enter Keg Number" onChange={event => setKegNo(event.target.value)} defaultValue={brew.kegNo}/>

                        <label>Bottle Number (500ml)</label>
                        <input type="text" name="bottleNo500" placeholder="Enter Bottle Number (500ml)" onChange={event => setBottleNo500(event.target.value)} defaultValue={brew.bottleNo500}/>

                        <label>Bottle Number (330ml)</label>
                        <input type="text" name="bottleNo330" placeholder="Enter Bottle Number (330ml)" onChange={event => setBottleNo330(event.target.value)} defaultValue={brew.bottleNo330}/>

                        <label>Status</label>
                        <input type="text" name="status" placeholder="Enter Status" onChange={event => setStatus(event.target.value)} defaultValue={brew.status}/>
                    </div>
                    <input type="submit" value="Update Brew"/>
                    {alertFormError}
                </form>  
            </React.Fragment>
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
            <center><Card style={{ width: '40%' }}>
                <Card.Body>
                    <Card.Title>Product Name: {brew.productName}</Card.Title>
                    <Card.Text>
                        Brew No: {brew.brewNo}
                    </Card.Text>
                </Card.Body>
            </Card></center>
            
            <button className="edit" onClick={(e) => editItem(brewId)}>Edit Item</button>
            <button onClick={(e) => deleteItem(brewId)}>Delete Item</button>
            {editForm}
        </React.Fragment>)
}
    

export default SingleBrew;