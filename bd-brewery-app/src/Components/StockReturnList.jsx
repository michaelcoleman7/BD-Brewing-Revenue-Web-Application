import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'

//set the url to receive the data from
const url = "http://127.0.0.1:5000/"

const StockReturnList = () => {

  const [stockReturns, setStockReturns] = useState([]);
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


  let stockReturnArray;
  if(stockReturns.length > 0){
    stockReturnArray = <div>
        {stockReturns.map(stockReturn => {
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
        {stockReturnArray}
      </div>
    </React.Fragment>)
  }

export default StockReturnList;