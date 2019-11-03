import React, { Component, useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import '../Stylesheets/Form.css';

const url = "http://127.0.0.1:5000/"

const divStyle = {
    width: '500px',
    border: '5px',
    background: '#f2f2f2',
    padding: '20px',
    margin: '10px'
  };

  const CreateBrewControlSheet = () => {
    // using react hooks to get data back - adapted from https://reactjs.org/docs/hooks-state.html
    const [brewNo, setBrewNo] = useState("");
    const [beer, setBeer] = useState("");

    const createcontrolsheet = (event) => {
            event.preventDefault();   

            //brew control sheet to be sent to server
            const brewcontrolsheet = {
                brewNo: brewNo,
                beer: beer
            }

            //options needed to send to server
            const options = {
                method: "post",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(brewcontrolsheet)
            }

            if(brewNo && beer){
                fetch(url +"api/createbrewcontrolsheet", options)
                .then(res => {
                    return res.json();
                }).catch(err => {
                    console.log(err)
                })

                
            }else{
                console.log("Invalid form format, will not be sent to database");
            }
    }

    return(
      <React.Fragment> 
        <div style={divStyle}>
            <form onSubmit={createcontrolsheet}>
                <label>Brew No.</label>
                <input type="text" name="BrewNo" placeholder="Enter Brew Number" onChange= {event => setBrewNo(event.target.value)}/>

                <label>Beer</label>
                <input type="text" name="beer" placeholder="Enter Beer" onChange={event => setBeer(event.target.value)}/>
            
                <input type="submit" value="Submit"/>
            </form>
        </div>
    </React.Fragment>)
}
    

export default CreateBrewControlSheet;