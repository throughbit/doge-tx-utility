/*
HYFERx Project
Tx Request Listener
Listens for a client request to create a transaction
Genererates a transaction output set and calls broadcast_tx
*/
//-o_O===<..>===================================================~|
'use strict';
//-o_O===modules================================================~|
var errorSet = require('./errors.js');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var tx_build = require('./build-tx-complete')
//-o_o===init======================================================|
var app = express();
const L_PORT=2020;
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
//Outputs will have to be provided by listening to a client
//Hardcoded for testing
//-o_o===server-===================================================|
app.post('/test_send',(req,res)=>{
 try{
  //console.log("IN");
  //one apprach is to take outputs as part of req.body
  let outputs = [{
   "address":"D8bTT8BK2gnzCVP3BYsCqiJPtkGVRxomVe",
   "amount": parseInt(1*1000000)
  }];
  tx_build.broadcast_tx(outputs)
  .then((result)=>{
   if(result.status){
    let response = errorSet.errorFunc("success: ", result.message);
    console.log(`Response: ${response}`);
    res.send(response);
   }
   if(!result.status){
    let response = errorSet.errorFunc("fail", result.message);
    console.log(`Response: ${response}`);
    res.send(response);
   }
  })
  .catch(err=>{
   let response = errorSet.errorFunc("fail: ", err);
   console.log(`Response:${response}`);
   res.send(response);
  });
 }
 catch(e){
   let response = errorSet.errorFunc("fail",e);
   console.log(response);
   res.send(response);
 }
});
//
//-o_o===server-===================================================|
app.listen(L_PORT,()=>
 console.log(`TxRequest Listener running on port ${L_PORT}`)
);
//-o_o===fin=======================================================|
