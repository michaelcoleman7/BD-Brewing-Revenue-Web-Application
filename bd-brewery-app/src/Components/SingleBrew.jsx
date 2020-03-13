import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import '../Stylesheets/Form.css';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';
import ReactToPrint from "react-to-print";
import '../Stylesheets/textinfo.css';
import '../Stylesheets/button.css';

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

  // react arrow function component to show a single brew
  const SingleBrew = (props) => {
    // using react hooks to change states - adapted from https://reactjs.org/docs/hooks-state.html
    const [brewId, setBrewId] = useState("");
    const [brew, setBrew] = useState("");
    const [changeBrew, setChangeBrew] = useState(false); 
    const [beer, setBeer] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [brewDate, setBrewDate] = useState("");
    const [og, setOG] = useState("");
    const [pg, setPG] = useState("");
    const [postConditionDate, setPCD] = useState("");
    const [postConditionVol, setPCV] = useState("");
    const [kegNo, setKegNo] = useState("");
    const [bottleNo500, setBottleNo500] = useState("");
    const [bottleNo330, setBottleNo330] = useState("");
    const [status, setStatus] = useState("");
    const [packaged, setPackaged] = useState(false);
    const [routeRedirect, setRedirect] = useState(""); 
    const [showAlert, setAlertShow] = useState(false);
    
    // function to get individual brew using specified id
    const getBrew = () => {
        //get id from url passed from previous component (props)
        let id = props.match.params.id;

        // Remove all the "" from the id - 
        //Note: Adding the /g will mean that all of the matching values are replaced,
        //otherwise just 1st occurance removed - https://stackoverflow.com/questions/1206911/why-do-i-need-to-add-g-when-using-string-replace-in-javascript
        let quotationlessId = id.replace(/['"]+/g, "");     
        setBrewId(quotationlessId);

        //add options with headers to ensure authorization
        const options = {
            method: "get",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
            }
        }

        //get individual brew from api call using url set in enviornemnt variables
        fetch(process.env.REACT_APP_API_URL+"api/brew/"+quotationlessId, options).then(res => {
            return res.json();
        }).then(res => {
            //set brew data into variables
            let parsed = JSON.parse(res.data);
            setBrew(parsed);
            setBeer(parsed.beer);
            setBatchNo(parsed.batchNo);
            setBrewDate(parsed.brewDate);
            setOG(parsed.og);
            setPG(parsed.pg);
            setPCD(parsed.postConditionDate);
            setPCV(parsed.postConditionVol);
            setKegNo(parsed.kegNo);
            setBottleNo500(parsed.bottleNo500);
            setBottleNo330(parsed.bottleNo330);
            setStatus(parsed.status);
            setPackaged(parsed.packaged);
        }).catch(err => {
            console.log(err);
        })
    }

    // call function to get single brew from api
    useEffect(() => {
        getBrew();
    },[]);

    // function to allow user to update brew
    const updateBrew = (e) => {
        e.preventDefault();
            //brew values to be sent to server
            const brew = {
                brewId: brewId,
                beer: beer,
                batchNo: batchNo,
                brewDate: brewDate,
                og: og,
                pg: pg,
                postConditionDate: postConditionDate,
                postConditionVol: postConditionVol,
                kegNo: kegNo,
                bottleNo500: bottleNo500,
                bottleNo330: bottleNo330,
                status: status,
                packaged: packaged
            }

          //add options with headers to ensure authorization and allow cross origin requests
          const options = { 
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : '*',
              'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
            },
               body: JSON.stringify(brew)   
          }
                      //if all data is valid, then post to server
                      if(beer && batchNo && brewDate && og && pg && postConditionDate && kegNo && bottleNo500 && bottleNo330 && status){
                        if(isNaN(parseFloat(og).toFixed(5)) || isNaN(parseFloat(pg).toFixed(5)) || isNaN(parseInt(kegNo)) || isNaN(parseInt(bottleNo500)) || isNaN(parseInt(bottleNo330))){
                            setAlertShow(!showAlert);
                            console.log("Invalid form format, will not be sent to database");
                        }
                        else{
                            //All data is valid, send to server via url saved in enviornment variables
                            fetch(process.env.REACT_APP_API_URL+"api/updateBrew/"+ brewId, options)
                            .then(res => {
                                return res.json();
                            }).then(res => {
                                //set redirect true - call rediect method to navigate from page
                                setRedirect(true);
                            }).catch(err => {
                                console.log(err)
                            });
                        }               
                    }else{
                        //set alert to show error data
                        setAlertShow(!showAlert);
                    }
    }

    let alertFormError;
    // if showalert is true - then display form error data to user
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
    let redirectRoute = "/brewlist/"+ beer
    // if rediect set to true. then navigate to brewlist
    if(redirect){
         return <Redirect to={redirectRoute}/>  
    }

    // function to delete brew from database
    const deleteItem = (brewId) => {
        //add options with headers to ensure authorization
        const options = { 
            method: 'delete',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
              
            },
            body: JSON.stringify({id: brewId})
          } 
          //send api call with id to delete to server
          fetch(process.env.REACT_APP_API_URL+"api/deleteBrew/"+ brewId , options)
          .then(res => {
            return res.json()
           })
           .then(res => {
               //set redirect to true - allow navigation
               setRedirect(true);
           }).catch(err => {
               console.log(err)
           })
    }

    // function to show form for updating brew
    const editItem = (brewId) => {
        setChangeBrew(!changeBrew);
    }

    let newDate;
    //fnction to set date based on user selection
    const dateChange = (date) => {
            newDate = format(new Date(date), 'dd-MM-yyyy')
            setBrewDate(newDate);
            document.getElementById('dp').placeholder=newDate;
    }


    let editForm;
    //if chnagefrom is true, then display form 
    if(changeBrew){
        editForm =
            <React.Fragment>
                <form style={formStyle} onSubmit={updateBrew}>
                        <label>Batch No</label>
                        <input type="text" name="batchNo" placeholder="Enter Batch Number" onChange={event => setBatchNo(event.target.value)} defaultValue={brew.batchNo}/>
                    
                    <div style={divStyle} className="float-left">

                        <label>Beer</label>
                        <input type="text" name="beer" placeholder="Enter Beer" onChange={event => setBeer(event.target.value)} defaultValue={brew.beer}/>

                        <label>Brew Date</label>
                        <div><input disabled="true" type="text" id="dp" name="brewDate" placeholder={brew.brewDate}/>
                        <DatePicker onChange={event => dateChange(event)}/>
                        </div><br/>

                        <label>OG (Original Gravity)</label>
                        <input type="text" name="og" placeholder="Enter OG" onChange={event => setOG(event.target.value)} defaultValue={brew.og}/>

                        <label>PG (Present Gravity)</label>
                        <input type="text" name="pg" placeholder="Enter PG" onChange={event => setPG(event.target.value)} defaultValue={brew.pg}/>

                        <input type="checkbox" name="brewpackaged" value="true" checked = {packaged} onChange={(e) => setPackaged(!packaged)} /> <label>Packaged</label> <br/>
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
                        <select onChange={event => setStatus(event.target.value)}>
                            <option>{brew.status}</option>
                            <option>Bottled</option>
                            <option>Kegged</option>
                            <option>Mixed</option>
                        </select>
                    </div>
                    <input type="submit" value="Update Brew"/>
                    {alertFormError}
                </form>  
            </React.Fragment>
    }
    
    //component with elements to show brew info
    class BrewInformation extends React.Component {
        render() {
          return (
            <center>
            <Card style={{ width: '50%' }}>
                <Card.Body>
                    <Card.Title><h3><b>Brew: {brew.beer}</b></h3></Card.Title>
                    <Card.Text>
                        <b>Batch Number:</b>  {brew.batchNo}<br/>
                        <b>Beer:</b>  {brew.beer}<br/>
                        <b>Brew Date:</b>  {brew.brewDate}<br/>
                        <b>Original Gravity (OG):</b>  {brew.og}<br/>
                        <b>Present Gravity (PG):</b>  {brew.pg}<br/>
                        <b>OG-PG:</b>  {brew.ogMinusPg}<br/>
                        <b>ABV%:</b>  {brew.abv}<br/>
                        <b>Post Condition Date:</b>  {brew.postConditionDate}<br/>
                        <b>Post Condition Volume:</b>  {brew.postConditionVol}<br/>
                        <b>Number of Kegs:</b>  {brew.kegNo}<br/>
                        <b>Number of Bottles (500ml):</b>  {brew.bottleNo500}<br/>
                        <b>Number of Bottles (330ml):</b>  {brew.bottleNo330}<br/>
                        <b>Duty:</b>  €{brew.duty}<br/>
                        <b>Status:</b>  {brew.status}<br/>
                    </Card.Text>
                </Card.Body>
            </Card></center>
          );
        }
      }  

      // Component to display brew info and allow printing of brew - adapted from - https://www.npmjs.com/package/react-to-print
      class BrewDisplay extends React.Component {
        render() {
        return (
            <div>
            <BrewInformation ref={el => (this.componentRef = el)} /><br/>
            <button className="button" onClick={(e) => editItem(brewId)}>Edit Brew</button>&nbsp; &nbsp; 
            <ReactToPrint
                trigger={() => <button className="button" href="#">Print Brew</button>}
                content={() => this.componentRef}
            />&nbsp; &nbsp;
            <button className="button" onClick={(e) => deleteItem(brewId)}>Delete Brew</button>
            </div>
        );
        }
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
            <BrewDisplay/>
            {editForm}
        </React.Fragment>)
}
//Export component for use
export default SingleBrew;