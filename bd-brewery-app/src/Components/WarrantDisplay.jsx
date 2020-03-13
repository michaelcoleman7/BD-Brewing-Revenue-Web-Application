import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import '../Stylesheets/Form.css';
import ReactToPrint from "react-to-print";
import Table from 'react-bootstrap/Table';
import '../Stylesheets/textinfo.css';

// Component used to display a warrent
const WarrentDisplay = (props) => {
    const [repaymentsAllowed, setRepaymentsAllowed] = useState("");
    const [totalDutyOwed, setTotalDutyOwed] = useState("");
    const [totalHLPercent, setTotalHLPercent] = useState("");
    const [totalDutyOwedLessRepayents, setTotalDutyOwedLessRepayents] = useState("");
    const [lessRepaymentsDuty, setLessRepaymentsDuty] = useState("");
    const dutyPayable = 22.55;
    const [brewerName, setBrewerName] = useState("");
    const [address, setAddress] = useState("");
    const [warehouseName, setWarehouseName] = useState("");
    const [IETWNo, setIETWNo] = useState("");
    const [IEWKNo, setIEWKNo] = useState("");
    const [payerRevenueNumber, setPayerRevenueNumber] = useState("");
    const [taxType, setTaxType] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [designationofSignatory, setDesignationofSignatory] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [currentMonth, setCurrentMonth] = useState("");
    const [currentYear, setCurrentYear] = useState("");

    // function to format date in required form, could also have used a react package to accomplish this - adpated from: https://stackoverflow.com/a/23593099
    function formatCurrentDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    }

    //function to get brewery information from api
    const getBreweryInfo = () => { 
        //add options with headers to ensure authorization
        const options = {
            method: "get",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
            }
        }

        //fetch brew info from api
        fetch(process.env.REACT_APP_API_URL+"api/brewinfo",options).then(res => {
            return res.json();
        }).then(res => {
            let parsed = JSON.parse(res.data);
            setBrewerName(parsed.brewerName);
            setAddress(parsed.address);
            setWarehouseName(parsed.warehouseName);
            setIETWNo(parsed.IETWNo);
            setIEWKNo(parsed.IEWKNo);
            setPayerRevenueNumber(parsed.payerRevenueNumber);
            setTaxType(parsed.taxType);
            setPhoneNumber(parsed.phoneNumber);
            setDesignationofSignatory(parsed.designationofSignatory);
            setCurrentDate(formatCurrentDate());
            //set months array with month names as getMonth returns integer value of month
            let monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            setCurrentMonth(monthNames[new Date().getMonth()]);
            setCurrentYear(new Date().getFullYear());
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        getBreweryInfo();
    },[]);
    
    //calculate values needed based on repayment values sent via props
    const setupCalculations = () => {
        setRepaymentsAllowed(props.location.state.repaymentsAllowed);
        setTotalHLPercent(props.location.state.totalHLPercent);
        setTotalDutyOwed(props.location.state.totalDutyOwed);
        setLessRepaymentsDuty(parseFloat(props.location.state.repaymentsAllowed * dutyPayable/2).toFixed(2));
        setTotalDutyOwedLessRepayents(parseFloat(props.location.state.totalDutyOwed) - parseFloat(props.location.state.repaymentsAllowed * dutyPayable/2).toFixed(2));    
    }

    useEffect(() => {
        setupCalculations();
    },[]);
    
    //component with elements to show brew info
    class BrewInformation extends React.Component {
        render() {
          return (
            <center>
            <Card style={{ width: '80%' }}>
                <Card.Body>
                    <Card.Title><h3><b>BREWER'S BEER DUTY RETURN</b></h3></Card.Title>
                    <Card.Text>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan="2">Name and Address of Person Paying Duty:</th>
                                <th colSpan="2">No. and Date (For Official Use):</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="2" rowSpan="2">{address}</td>
                                <td colSpan="2"><b>Warehouse Name: </b><br/>{warehouseName}</td>
                                <td><b>IETW No:</b><br/>{IETWNo}</td>
                                <td><b>IEWK No:</b><br/>{IEWKNo}</td>
                            </tr>
                            <tr>
                                <td><b>Month:</b><br/>{currentMonth}<br/></td>
                                <td><b>Year:</b><br/>{currentYear}</td>
                                <td><b>Payer Revenue Number:</b><br/>{payerRevenueNumber}</td>
                                <td><b>Tax Type:</b><br/>{taxType}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <br/><br/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Excise Home (ERN 9820)</th>
                                <th>Quantity (HL%):</th>
                                <th>Rate of Duty:</th>
                                <th>Duty Payable (€):</th>
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
                                <th>Less Repayment amounts:</th>
                                <td>{repaymentsAllowed}</td>
                                <td>{dutyPayable}/2</td>
                                <td>{lessRepaymentsDuty}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>Net Payable:</th>
                                <td></td>
                                <td colSpan="2">{totalDutyOwedLessRepayents}</td>
                            </tr>
                        </tbody>
                    </Table>
                        <br/><br/>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Value for VAT:</th>
                                <th>Rate of VAT:</th>
                                <th>VAT Payable (€):</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                        <br/><br/>
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <th>Total Amount for Direct Debit:</th>
                                    <td>{totalDutyOwedLessRepayents}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Text>
                    <br/>
                    <Card.Text>
                        <p>I <b>{brewerName}</b> declare that the particulars herin and on the attached schedules are true and complete and that the above amount will be paid by Direct Debit under the Revenue Number shown herein</p>
                        <p style={{float: 'left'}}><b>Signature:</b> _______________________________________</p><br/> <p style={{float: 'right', display : 'inline-block'}}><b>Date: </b>{currentDate}</p><br/>
                        <p style={{float: 'left'}}><b>Designation of Signatory:</b> {designationofSignatory}</p><br/> <p style={{float: 'right', display : 'inline-block'}}><b>Phone Number:</b> {phoneNumber}</p><br/><br/>

                        <p>(1) The quantity of beer to be entered here is the quantity delivered from warehouse for home consumption, 
                            including any beer consumed on the brewery premises, plus any additions for previous underdeclarations.</p>
                            <p>(2) Only repayments that have been authorised by the Revenue Official can be deducted here.</p>

                    </Card.Text>
                </Card.Body>
            </Card></center>
          );
        }
      } 
      
    //Component to display brew info and allow printing of brew - adapted from - https://www.npmjs.com/package/react-to-print
    class BrewDisplay extends React.Component {
        render() {
        return (
            <div>
            <BrewInformation ref={el => (this.componentRef = el)} /><br/>
            <ReactToPrint
                trigger={() => <button className="button" href="#">Print Warrent</button>}
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
//Export component for use  
export default WarrentDisplay;