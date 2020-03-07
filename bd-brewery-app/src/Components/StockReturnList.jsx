import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const StockReturnList = () => {

  const [stockReturns, setStockReturns] = useState([]);
  const [monthDate, setMonthDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("None Selected");
  const getStockReturns = () => {
    fetch(url+"api/stockreturn").then(res =>{
      return res.json();
    }).then(stockReturns => {
      console.log(stockReturns);
      setStockReturns(stockReturns.data);
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getStockReturns();
  }, [])

  const listItem = {
    width: '18rem',
    width: '40%',
    color: 'white',
    marginTop: '10px',
    fontFamily: 'Cursive',
    fontSize: '20px',
    borderStyle: 'solid',
    borderColor: 'brown',
    background: 'rgba(144, 84, 23, 0.5)'
  };

  let stockReturnList = []
  for (var i = 0; i < stockReturns.length; i++) {
    console.log(stockReturns[i].stockReturnDate);
    console.log(monthDate);
    if(stockReturns[i].stockReturnDate == monthDate){
      stockReturnList.push(stockReturns[i]);
    }
    else if(monthDate == ""){
      stockReturnList.push(stockReturns[i]);
    }
  }

  let newDate;
  const dateChange = (date) => {
          newDate = format(new Date(date), 'MM-yyyy')
          setMonthDate(newDate);
          setSelectedMonth("Current selected Month is: "+ newDate);
  }


  let stockReturnArray;
  if(stockReturnList.length > 0){
    stockReturnArray = <div>
        {stockReturnList.map(stockReturn => {
          return(
            <div key={stockReturn._id}>
              <Link to={"../stockreturn/"+stockReturn._id}>
                <ListGroup>
                <center>
                    <ListGroup.Item style={listItem}>{stockReturn.beer}</ListGroup.Item>
                </center>
                </ListGroup>
              </Link>
            </div>
          )
        })}
      </div>
  }else{
    stockReturnArray = 
    <div>
      <h1 style={{color: "white"}}>No Stock Returns exist in the database, Please create a Stock Return</h1>
    </div>
  }

return(
    <React.Fragment> 
      <div>
      <h5 style={{color: "white"}}>Select a Date in the month you wish to sort by: {selectedMonth}</h5>
      <DatePicker format="MM/yyyy" onChange={event => dateChange(event)}/>
      <h1 style={{color: "white"}}>Stock Return List</h1>
        {stockReturnArray}
      </div>
    </React.Fragment>)
  }

export default StockReturnList;