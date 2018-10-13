/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Transaction input builder (UTxO)
Requests remote node for unspent outputs of given addresses, which are used as inputs to a new transaction
*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
var request = require('request');
var bodyParser = require('body-parser');
var errorSet = require('./errors.js');
//-o_O===init===================================================~|
//NI_PORT: Port running node interface
var NI_PORT = process.env.NI_PORT;
const RPC_AUTH = process.env.RPC;
const server_url = `http://localhost:${NI_PORT}/get_utxo`;

//Link all addresses of the given key containing UTxO
//-o_o===request-utxo============================================|
function build_TxInputs(addresses) {
 return new Promise((resolve,reject)=>{
  try{
   let options = {
      headers:{ "content-type": "application/JSON" },
      url: server_url,
      method: 'POST',
      body:{"addresses":addresses},
      json: true
   }
   console.log("Options passed to get_utxo request: ", options);
   request.post(options, (error, response, body)=>{
    if(error){
     let resp = errorSet.errorFunc("fail",error);
     console.log("Rejecting: error from request to get_utxo: ",error);
     reject (resp);
    }
    console.log("BODY FROM UTXO REQUEST: ",body);
    if(body.status){
     console.log("Request to/get_utxo returned body: ",body.message);
     let utxo_set=body.message;

     utxo_format(utxo_set)
     .then((utxo_form)=>{
      if(utxo_form.status){
       let resp = errorSet.errorFunc("success", utxo_form.message);
       console.log("Resolving: Utxo's have  been formatted: ", utxo_form.message);
       resolve (resp);
      }
      if(!utxo_form.status){
       let resp = errorSet.errorFunc("fail",utxo_form.message);
       console.log("Rejecting: Error Formatting Utxo: ", utxo_form.message);
       resolve (resp);
      }
     });
    }
    if(!body.status){
     let resp = errorSet.errorFunc("fail", body.message);
     console.log("Received error status from request to /get_utxo \n",body.message);
     reject (resp);
    }
   });//close the request
  }
  catch(e){
   let resp = errorSet.errorFunc("fail", e);
   console.log("Rejecting: error caught while trying to get_utxo: ", e);
   reject(resp);
  }
 });
}
/*var processItems = function(x){
  if( x < urls.length ) {
    http.get(urls[x], function(res) {

      // add some code here to process the response

      processItems(x+1);
    });
  }*/
//-o_O===format-utxo============================================~|
function utxo_format (utxos){
 return new Promise((resolve,reject)=>{
  try{
   //MAP METHOD
   
   // var uform = utxos.map((val,i,utxos)=>{
   //  return val = {
   //    "txId" : utxos[i].txid,
   //    "outputIndex" : utxos[i].vout,
   //    "address" : utxos[i].address,
   //    "script":utxos[i].scriptPubKey,
   //    "satoshis" : parseInt(utxos[i].amount * 100000000)
   //  }
   // });
   // resolve(uform);
   
   //RECURSION METHOD
   var uform = new Array();
   var collect_utxoform = function(i){
    if(i < utxos.length){
     console.log("rec round: ", i);
     uform.push({
       "txId" : utxos[i].txid,
       "outputIndex" : utxos[i].vout,
       "address" : utxos[i].address,
       "script":utxos[i].scriptPubKey,
       "satoshis" : parseInt(utxos[i].amount * 100000000)
     });
    collect_utxoform(i+1);
    }
    if(i>=utxos.length){
     let resp = errorSet.errorFunc("success", uform);
     console.log("Resolving: Recursion ended. UtXo's are formatted. \n",uform)
     resolve (resp);
    }
   }
   collect_utxoform(0);
  }
  catch(e){
   let resp = errorSet.errorFunc("fail",e);
   console.log("Rejecting: Caught an error while trying to format UTxO's: ", e);
   reject(resp);
  }
 });
}
//-o_O===exports===============================================~|
module.exports = {build_TxInputs};
//-o_0===fin====================================================|
