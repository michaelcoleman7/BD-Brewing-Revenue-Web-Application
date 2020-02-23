import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import '../Stylesheets/Form.css';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';
import ReactToPrint from "react-to-print";

  const WarrentDisplay = (props) => {
      console.log("props: "+ props.location.state.repaymentsAllowed);
    
    //adapted from - https://www.npmjs.com/package/react-to-print
    class BrewInformation extends React.Component {
        render() {
          return (
            <center>
            <Card style={{ width: '50%' }}>
                <Card.Body>
                    <Card.Title><h3><b>BREWER'S BEER DUTY RETURN</b></h3></Card.Title>
                    <Card.Text>
                    <p>hello</p>
                    </Card.Text>
                </Card.Body>
            </Card></center>
          );
        }
      }    
    class BrewDisplay extends React.Component {
        render() {
        return (
            <div>
            <BrewInformation ref={el => (this.componentRef = el)} />
            <ReactToPrint
                trigger={() => <button href="#">Print Warrent</button>}
                content={() => this.componentRef}
            />
            </div>
        );
        }
    }

    return(
        // React Fragment is a way of sending back multiple elements - https://reactjs.org/docs/fragments.html
        <React.Fragment> 
            <BrewDisplay/>
        </React.Fragment>)
}
    

export default WarrentDisplay;