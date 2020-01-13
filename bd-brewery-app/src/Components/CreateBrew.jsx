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
    const [productName, setProductName] = useState("");
    const [brewNo, setBrewNo] = useState("");
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
    const [routeRedirect, setRedirect] = useState(false); 
    const [showAlert, setAlertShow] = useState(false);

    const create = (event) => {
            event.preventDefault();   

            //brew values to be sent to server
            const brew = {
                productName: productName,
                brewNo: brewNo,
                beer: beer,
                batchNo: batchNo,
                brewDate: brewDate,
                og: og,
                pg: pg,
                postConditionDate: postConditionDate,
                kegNo: kegNo,
                bottleNo500: bottleNo500,
                bottleNo330: bottleNo330,
                status: status
            }

            //options needed to send request to server
            const options = {
                method: "post",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(brew)
            }

            //if all data is valid, then post to server
            if(productName && brewNo && beer && batchNo && brewDate && og && pg && postConditionDate && kegNo && bottleNo500 && bottleNo330 && status){
                if(isNaN(parseFloat(og).toFixed(5)) || isNaN(parseFloat(pg).toFixed(5)) || isNaN(parseInt(kegNo)) || isNaN(parseInt(bottleNo500)) || isNaN(parseInt(bottleNo330))){
                    setAlertShow(!showAlert);
                    console.log("Invalid form format, will not be sent to database");
                }
                else{
                    fetch(url +"api/createbrew", options)
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
         return <Redirect to="/brew" />  
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
                <form style={formStyle} onSubmit={create}>
                        <label>Product Name</label>
                        <input type="text" name="ProductName" placeholder="Enter Product Name" onChange= {event => setProductName(event.target.value)}/>
                    <div style={divStyle} className="float-left">

                        <label>Brew No.</label>
                        <input type="text" name="BrewNo" placeholder="Enter Brew Number" onChange= {event => setBrewNo(event.target.value)}/>

                        <label>Beer</label>
                        <input type="text" name="beer" placeholder="Enter Beer" onChange={event => setBeer(event.target.value)}/>

                        <label>Batch No</label>
                        <input type="text" name="batchNo" placeholder="Enter Batch Number" onChange={event => setBatchNo(event.target.value)}/>

                        <label>Brew Date</label>
                        <input type="text" name="brewDate" placeholder="Enter Brew Date" onChange={event => setBrewDate(event.target.value)}/>

                        <label>OG (Original Gravity) - Number required</label>
                        <input type="text" name="og" placeholder="Enter OG" onChange={event => setOG(event.target.value)}/>

                        <label>PG (Present Gravity) - Number required</label>
                        <input type="text" name="pg" placeholder="Enter PG" onChange={event => setPG(event.target.value)}/>
                    </div>
                    <div className="float-right" style={divStyle}>
                        <label>Post Conditioning Date</label>
                        <input type="text" name="postConditionDate" placeholder="Enter Post Conditioning Date" onChange={event => setPCD(event.target.value)}/>

                        <label>Keg No - Number required</label>
                        <input type="text" name="kegNo" placeholder="Enter Keg Number" onChange={event => setKegNo(event.target.value)}/>

                        <label>Bottle Number (500ml) - Number required</label>
                        <input type="text" name="bottleNo500" placeholder="Enter Bottle Number (500ml)" onChange={event => setBottleNo500(event.target.value)}/>

                        <label>Bottle Number (330ml) - Number required</label>
                        <input type="text" name="bottleNo330" placeholder="Enter Bottle Number (330ml)" onChange={event => setBottleNo330(event.target.value)}/>

                        <label>Status</label>
                        <input type="text" name="status" placeholder="Enter Status" onChange={event => setStatus(event.target.value)}/>
                    </div>
                    <input type="submit" value="Create Brew"/>
                    {alertFormError}
                </form>

        </React.Fragment>)
}
    

export default CreateBrew;