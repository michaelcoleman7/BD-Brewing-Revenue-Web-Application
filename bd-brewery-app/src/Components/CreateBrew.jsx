import React, { useState,useEffect } from 'react';
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import '../Stylesheets/Form.css';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';

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

  // react arrow function component to create a brew
  const CreateBrew = () => {
    // using react hooks to change states - adapted from https://reactjs.org/docs/hooks-state.html
    const [beer, setBeer] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [brewDate, setBrewDate] = useState("");
    const [og, setOG] = useState("");
    const [pg, setPG] = useState("");
    const [postConditionDate, setPCD] = useState("");
    const [kegNo, setKegNo] = useState("");
    const [bottleNo500, setBottleNo500] = useState("");
    const [bottleNo330, setBottleNo330] = useState("");
    const [status, setStatus] = useState("");
    const [packaged, setPackaged] = useState("");
    const [routeRedirect, setRedirect] = useState(false); 
    const [showAlert, setAlertShow] = useState(false);
    const [brews, setbrews] = useState([]);
    const [invalidBatch, setInvalidBatch] = useState(false);


    //Function to get brews from api - used to check if batchNo already exists
    const getBrews = () => {
        fetch(process.env.REACT_APP_API_URL+"api/brew").then(res =>{
            return res.json();
        }).then(brews => {
            setbrews(brews.data);
        }).catch(err => {
            console.log(err);
        })
        }
        
        //call function to get brews info fromapi
        useEffect(() => {
        getBrews();
        }, [])

    //function to create a brew and send to server
    const create = (event) => {
            event.preventDefault();   

            //brew values to be sent to server
            const brew = {
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

            //options needed to send request to server
            const options = {
                method: "post",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(brew)
            }

            let invalidBatch = false
            for (var i = 0; i < brews.length; i++) {
                if(brews[i].batchNo == batchNo){
                    invalidBatch = true;
                    setInvalidBatch(true);
                }
            }

            //if all data is valid, then post to server
            if( beer && batchNo && brewDate && og && pg && postConditionDate && kegNo && bottleNo500 && bottleNo330 && status && packaged && invalidBatch == false){
                if(status == "Bottled" || status == "Kegged" || status == "Mixed"){
                    if(isNaN(parseFloat(og).toFixed(5)) || isNaN(parseFloat(pg).toFixed(5)) || isNaN(parseInt(kegNo)) || isNaN(parseInt(bottleNo500)) || isNaN(parseInt(bottleNo330))){
                        // show alert of invalid data
                        setAlertShow(!showAlert);
                    }
                    else{
                        //all data valid, send data to server via url set in enviornment variables
                        fetch(process.env.REACT_APP_API_URL +"api/createbrew", options)
                        .then(res => {
                            //set redirect true - calls redirect method
                            setRedirect(true);
                            return res.json();
                        }).catch(err => {
                            console.log(err)
                        })
                    }   
                }            
            }else{
                // show alert of invalid data
                setAlertShow(!showAlert);
            }
        
    }

    let alertFormError;
    // when showalert is true then show alert with error data
    if(showAlert){
        if(invalidBatch){
            alertFormError =
            <React.Fragment>
                <Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
                    <Alert.Heading>Invalid Form Format!</Alert.Heading>
                    <p>
                        The batch Number entered already exists in the database, Please try another batch number
                    </p>
                </Alert>
            </React.Fragment>
        }
        else{
            alertFormError =
            <React.Fragment>
                <Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
                    <Alert.Heading>Invalid Form Format!</Alert.Heading>
                    <p>
                        Please ensure all form fields are filled out and ensure numberical values are displayed for correct fields
                    </p>
                </Alert>
            </React.Fragment>
        }
    }

    // Redirect to brew page after creation
    const redirect = routeRedirect;
    if(redirect){
        // Redirect to brew url
        return <Redirect to="/brew" />  
    }
     
    let newDate;
    //setup date based on user selection
    const dateChange = (date) => {
        newDate = format(new Date(date), 'dd-MM-yyyy')
        setBrewDate(newDate);
        document.getElementById('dp').placeholder=newDate;
    }

    //return fragment with elements to display to user
    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
                <form style={formStyle} onSubmit={create}>
                        <label>Batch No</label>
                        <input type="text" name="batchNo" placeholder="Enter Batch Number" onChange={event => setBatchNo(event.target.value)}/>
                    <div style={divStyle} className="float-left">

                        <label>Beer</label>
                        <input type="text" name="beer" placeholder="Enter Beer" onChange={event => setBeer(event.target.value)}/>

                        <label>Brew Date</label>
                        <div><input disabled="true" type="text" id="dp" name="brewDate" placeholder="Select a Date using Date Picker Below"/>
                        <DatePicker onChange={event => dateChange(event)}/>
                        </div><br/>
                        <label>OG (Original Gravity) - Number required</label>
                        <input type="text" name="og" placeholder="Enter OG" onChange={event => setOG(event.target.value)}/>

                        <label>PG (Present Gravity) - Number required</label>
                        <input type="text" name="pg" placeholder="Enter PG" onChange={event => setPG(event.target.value)}/>

                        <input type="radio" name="brewpackaged" value="true"  onChange={event => setPackaged(event.target.value)}/> Packaged
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
                        <select onChange={event => setStatus(event.target.value)}>
                            <option>Select Packaging Status...</option>
                            <option>Bottled</option>
                            <option>Kegged</option>
                            <option>Mixed</option>
                        </select>

                        <input type="radio" name="brewpackaged" value="false" onChange={event => setPackaged(event.target.value)}/> Unpackaged
                    </div>
                    <input type="submit" value="Create Brew"/>
                    {alertFormError}
                </form>
        </React.Fragment>)
}   
// Export create brew for use
export default CreateBrew;