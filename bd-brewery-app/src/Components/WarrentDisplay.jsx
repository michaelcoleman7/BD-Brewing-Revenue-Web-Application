import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Redirect } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import '../Stylesheets/Form.css';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';
import ReactToPrint from "react-to-print";
import Table from 'react-bootstrap/Table';



  const WarrentDisplay = (props) => {
    const [repaymentsAllowed, setRepaymentsAllowed] = useState("");
    const [repaymentsAllowedDuty, setRepaymentsAllowedDuty] = useState("");
    const [totalDutyOwed, setTotalDutyOwed] = useState("");
    const [totalHLPercent, setTotalHLPercent] = useState("");
    const [totalDutyOwedLessRepayents, setTotalDutyOwedLessRepayents] = useState("");
    const [lessRepaymentsDuty, setLessRepaymentsDuty] = useState("");
    const dutyPayable = 22.55;
    

    const setupCalculations = () => {
        setRepaymentsAllowed(props.location.state.repaymentsAllowed);
        setTotalHLPercent(props.location.state.totalHLPercent);
        setTotalDutyOwed(props.location.state.totalDutyOwed);
        setTotalDutyOwedLessRepayents(parseFloat(props.location.state.totalDutyOwed) - parseFloat(props.location.state.repaymentsAllowed));
        setLessRepaymentsDuty(parseFloat(props.location.state.repaymentsAllowed * dutyPayable/2).toFixed(2));
        
    }

    useEffect(() => {
        setupCalculations();
    },[]);
    
    //adapted from - https://www.npmjs.com/package/react-to-print
    class BrewInformation extends React.Component {
        render() {
          return (
            <center>
            <Card style={{ width: '50%' }}>
                <Card.Body>
                    <Card.Title><h3><b>BREWER'S BEER DUTY RETURN</b></h3></Card.Title>
                    <Card.Text>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Excise Home (ERN 9820)</th>
                                <th>Quantity (HL%)</th>
                                <th>Rate of Duty</th>
                                <th>Duty Payable (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Delivered for Home Consumption:</th>
                                    <td>{totalHLPercent}</td>
                                    <td>{dutyPayable}/2</td>
                                    <td>{totalDutyOwed}</td>
                                </tr>
                                <tr>
                                    <th>Less Repayment amounts</th>
                                    <td>{repaymentsAllowed}</td>
                                    <td>{dutyPayable}/2</td>
                                    <td>{lessRepaymentsDuty}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Net Payable</th>
                                    <td>{dutyPayable}/2</td>
                                    <td colSpan="2">{totalDutyOwedLessRepayents}</td>
                                </tr>
                            </tbody>
                        </Table>
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