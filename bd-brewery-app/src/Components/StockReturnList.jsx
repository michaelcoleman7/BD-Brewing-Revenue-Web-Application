import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import DatePicker from 'react-date-picker';
import { format } from 'date-fns';

//component used to display list of stock returns
const StockReturnList = () => {
  const [stockReturns, setStockReturns] = useState([]);
  const [monthDate, setMonthDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("None Selected");
  const getStockReturns = () => {
    //fetch stock return data from api
    fetch(process.env.REACT_APP_API_URL+"api/stockreturn").then(res =>{
      return res.json();
    }).then(stockReturns => {
      //set stock returns to returned data
      setStockReturns(stockReturns.data);
    }).catch(err => {
      console.log(err);
    })
  }
  //call function to call api to get stock returns
  useEffect(() => {
    getStockReturns();
  }, [])

  //css for each list item
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
  //craete a list of stock returns based on user selected month
  for (var i = 0; i < stockReturns.length; i++) {
    //if stock returns date is equal to month date selected by use, then add to list
    if(stockReturns[i].stockReturnDate == monthDate){
      stockReturnList.push(stockReturns[i]);
    }
    //no month selected, then display all stock returns
    else if(monthDate == ""){
      stockReturnList.push(stockReturns[i]);
    }
  }

  let newDate;
  //set date based on user selected date
  const dateChange = (date) => {
    newDate = format(new Date(date), 'MM-yyyy')
    setMonthDate(newDate);
    setSelectedMonth("Current selected Month is: "+ newDate);
  }

  let stockReturnArray;
  //if stock return list is greater than 0, then map each stock returns to a link and display
  if(stockReturnList.length > 0){
    stockReturnArray = <div>
        {stockReturnList.map(stockReturn => {
          return(
            <div key={stockReturn._id}>
              <Link to={"../stockreturn/"+stockReturn._id}>
                <ListGroup>
                <center>
                    <ListGroup.Item style={listItem}>{stockReturn.beer} : {stockReturn.stockReturnDate}</ListGroup.Item>
                </center>
                </ListGroup>
              </Link>
            </div>
          )
        })}
      </div>
  }else{
    //if no stock returns in list then display this to user
    stockReturnArray = 
    <div>
      <h1 style={{color: "white"}}>No Stock Returns exist in the database, Please create a Stock Return</h1>
    </div>
  }
//return elements to display to user
return(
    <React.Fragment> 
      <div>
      <h5 style={{color: "white"}}>Select a Date in the month you wish to sort by: {selectedMonth}</h5>
      <DatePicker format="MM/yyyy" onChange={event => dateChange(event)}/>
      <h2 style={{color: "white"}}>Stock Return List</h2>
        {stockReturnArray}
      </div>
    </React.Fragment>)
  }

export default StockReturnList;