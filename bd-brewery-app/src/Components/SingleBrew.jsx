import React, { Component, useEffect, useState } from 'react';
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
  const SingleBrew = (props) => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [brewId, setBrewId] = useState("");
    const [brew, setBrew] = useState("");
    const [editBrew, setEditBrew] = useState("");

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

            setBrewNo(parsed.brewNo);
            setBeer(parsed.beer);
            setBatchNo(parsed.batchNo);
            setBrewDate(parsed.brewDate);
            setOG(parsed.og);
            setPG(parsed.pg);
            setABV(parsed.abv);
            setPCD(parsed.postConditionDate);
            setPCV(parsed.postConditionVol);
            setKegNo(parsed.kegNo);
            setBottleNo500(parsed.bottleNo500);
            setBottleNo330(parsed.bottleNo330);
            setDuty(parsed.duty);
            setStatus(parsed.status);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getBrew();
    },[]);

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
            <p>Brew No: {brew.brewNo}</p><br/>
            <p>Beer: {brew.beer}</p><br/>
            <p>BatchNo: {brew.batchNo}</p><br/>
            <p>Brewdate: {brew.brewDate}</p><br/>
            <p>OG: {brew.og}</p><br/>
            <p>PG: {brew.pg}</p><br/>
            <p>ABV: {brew.abv}</p><br/>
            <p>postConditionDate: {brew.postConditionDate}</p><br/>
            <p>postConditionVol: {brew.postConditionVol}</p><br/>
            <p>kegNo: {brew.kegNo}</p><br/>
            <p>bottleNo500: {brew.bottleNo500}</p><br/>
            <p>bottleNo330: {brew.bottleNo330}</p><br/>
            <p>duty: {brew.duty}</p><br/>
            <p>status: {brew.status}</p><br/>
            
        </React.Fragment>)
}
    

export default SingleBrew;