/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
DGB Transaction output builder
Requests a client for a set of outputs (to_address:amount) for a transaction
*/
//-o_o===--======================================================|
'use strict';
//-o_o===modules=================================================|
var request = require('request');
var bodyParser = require('body-parser');
//-o_O===init===================================================~|
const RPC_AUTH =``;
const Ob_TxSet = ``;
//-o_o===get-outputs=============================================|
function build_tx_outputs() {
 return new Promise((resolve, reject)=>{
  request.post({
   "headers": { "content-type": "application/json" },
   "url": Ob_TxSet,
   "body": JSON.stringify({"coinId":'5'})
  },(error, response, body)=>{
     if(error){
     // console.log(error);
      reject (error);
     }
     let tx_set=JSON.parse(body);
     //console.log(utxo_set);
     let txS_f = tx_outs_format(tx_set);
     //console.log(utxo_f);
     resolve (txS_f);
   });
 });
}
//-o_O===format-outputs========================================~|
function tx_outs_format (tx_set){
 try{
  var txS = tx_set.map((val,i,tx_set)=>{
   return val = {
     "address" : tx_set[i].address,
     "amount" : parseInt(tx_set[i].amount)
   }
  });
  return txS;
 }
 catch(e){
  return e;
 }
}//-o_O===format-outputs-command-line=========================~|
function tx_outs_format_cmd (address,amount){
 try{
  var txS = tx_set.map((val,i,tx_set)=>{
   return val = {
     "address" : address,
     "amount" : parseInt(amount)
   }
  });
  return txS;
 }
 catch(e){
  return e;
 }
}
//-o_0===exports=================================================|
module.exports = {build_tx_outputs,tx_outs_format};
//-o_0===fin=====================================================|
