import React, { Component, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import '../Stylesheets/Form.css';

//set the url to send the data to
const url = "http://127.0.0.1:5000/"

// Set some styling for div
const divStyle = {
    width: '48%',
    border: '5px',
    background: '#f2f2f2',
    padding: '20px',
    margin: '10px'
  };



  // react arrow function component to create a brew
  const CreateBrew = () => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [brewNo, setBrewNo] = useState("");
    const [beer, setBeer] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [brewDate, setBrewDate] = useState("");
    const [og, setOG] = useState("");
    const [pg, setPG] = useState("");
    //OG-PG is a also a variable, calculate using above values
    const [abv, setABV] = useState("");
    const [postConditionDate, setPCD] = useState("");
    const [postConditionVol, setPCV] = useState("");
    const [kegNo, setKegNo] = useState("");
    const [bottleNo500, setBottleNo500] = useState("");
    const [bottleNo330, setBottleNo330] = useState("");
    const [duty, setDuty] = useState("");
    const [status, setStatus] = useState("");
    const [routeRedirect, setRedirect] = useState(false); 

    const create = (event) => {
            event.preventDefault();   

            //brew values to be sent to server
            const brew = {
                brewNo: brewNo,
                beer: beer,
                batchNo: batchNo,
                brewDate: brewDate,
                og: og,
                pg: pg,
                abv: abv,
                postConditionDate: postConditionDate,
                postConditionVol: postConditionVol,
                kegNo: kegNo,
                bottleNo500: bottleNo500,
                bottleNo330: bottleNo330,
                duty: duty,
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
            if(brewNo && beer && batchNo && brewDate && og && pg && abv && postConditionDate && postConditionVol && kegNo && bottleNo500 && bottleNo330 && duty && status){
                fetch(url +"api/createbrew", options)
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

    // Redirect to brew page after creation
    const redirect = routeRedirect;
    if(redirect){
         return <Redirect to="/brew" />  
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
                <form onSubmit={create}>
                    <div style={divStyle} className="float-left">
                        <label>Brew No.</label>
                        <input type="text" name="BrewNo" placeholder="Enter Brew Number" onChange= {event => setBrewNo(event.target.value)}/>

                        <label>Beer</label>
                        <input type="text" name="beer" placeholder="Enter Beer" onChange={event => setBeer(event.target.value)}/>

                        <label>Batch No</label>
                        <input type="text" name="batchNo" placeholder="Enter Batch Number" onChange={event => setBatchNo(event.target.value)}/>

                        <label>Brew Date</label>
                        <input type="text" name="brewDate" placeholder="Enter Brew Date" onChange={event => setBrewDate(event.target.value)}/>

                        <label>OG (Original Gravity)</label>
                        <input type="text" name="og" placeholder="Enter OG" onChange={event => setOG(event.target.value)}/>

                        <label>PG (Present Gravity)</label>
                        <input type="text" name="pg" placeholder="Enter PG" onChange={event => setPG(event.target.value)}/>

                        <label>ABV</label>
                        <input type="text" name="abv" placeholder="Enter ABV" onChange={event => setABV(event.target.value)}/>
                    </div>
                    <div className="float-right" style={divStyle}>
                        <label>Post Conditioning Date</label>
                        <input type="text" name="postConditionDate" placeholder="Enter Post Conditioning Date" onChange={event => setPCD(event.target.value)}/>

                        <label>Post Conditioning Volume</label>
                        <input type="text" name="postConditionVol" placeholder="Enter Post Conditioning Volume" onChange={event => setPCV(event.target.value)}/>

                        <label>Keg No</label>
                        <input type="text" name="kegNo" placeholder="Enter Keg Number" onChange={event => setKegNo(event.target.value)}/>

                        <label>Bottle Number (500ml)</label>
                        <input type="text" name="bottleNo500" placeholder="Enter Bottle Number (500ml)" onChange={event => setBottleNo500(event.target.value)}/>

                        <label>Bottle Number (330ml)</label>
                        <input type="text" name="bottleNo330" placeholder="Enter Bottle Number (330ml)" onChange={event => setBottleNo330(event.target.value)}/>

                        <label>Duty</label>
                        <input type="text" name="duty" placeholder="Enter Duty" onChange={event => setDuty(event.target.value)}/>

                        <label>Status</label>
                        <input type="text" name="status" placeholder="Enter Status" onChange={event => setStatus(event.target.value)}/>
                    </div>
                    <input type="submit" value="Create Brew"/>
                </form>
        </React.Fragment>)
}
    

export default CreateBrew;