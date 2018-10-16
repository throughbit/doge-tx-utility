/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Transaction input builder (UTxO)
Requests remote node for unspent outputs of given addresses, which are used as inputs for requested transaction
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
const server_url = `http://localhost:${NI_PORT}/tx_detail_global`;

//Link all addresses of the given key containing UTxO
//-o_o===request-utxo============================================|
function build_TxInputs(txid) {
 return new Promise((resolve,reject)=>{
  try{

   let options = {
      headers:{ "content-type": "application/JSON" },
      url: server_url,
      method: 'POST',
      body:{"txid":txid},
      json: true
   }
   console.log("Options passed to tx_detail_global request: ", options);
   request.post(options, (error, response, body)=>{
    if(error){
     let resp = errorSet.errorFunc("fail",error,[]);
     console.log("Rejecting: error from request to tx_detail_global: ",error);
     reject (resp);
     //retry?
    }
    console.log("BODY FROM tx_detail_global: ",body);
    if(body.status){
     console.log("Request to /tx_detail_global returned body: ",body.message_object);
     let utxo_set=body.message_object;

     utxo_format(utxo_set)
     .then((utxo_form)=>{
      if(utxo_form.status){
       let resp = errorSet.errorFunc("success","Sending Array", utxo_form.message_array);
       console.log("Resolving: Utxo's have  been formatted: ", resp);
       resolve (resp);
      }
      if(!utxo_form.status){
       let resp = errorSet.errorFunc("fail",utxo_form.message);
       console.log("Rejecting: Error Formatting Utxo: ",resp);
       resolve (resp);
       //retry?
      }
     });
    }
    if(!body.status){
     let resp = errorSet.errorFunc("fail", JSON.stringify(body.message));
     console.log("Received error status from request to /get_utxo \n",resp);
     reject (resp);
     //retry?
    }
   });//close the request
  }
  catch(e){
   let resp = errorSet.errorFunc("fail", e);
   console.log("Rejecting: error caught while trying to get_utxo: ", e);
   reject(resp);
   //retry?
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
   const myaddress = process.env.ADD_0;
   //this is the only address we will be using to send
   //cold wallet only sends here
   var uform = new Array();
   console.log("HERE TO FORMAT: \n",utxos);
   var collect_utxoform = function(i){
    console.log("rec layer: ", 0);
    if(i < utxos.vout.length){
     console.log("rec layer: ", 1);
     console.log(utxos.vout[i].scriptPubKey);
     if(utxos.vout[i].scriptPubKey.addresses[0]===myaddress){
      console.log("rec layer: ", 2);
      uform.push({
        "txId" : utxos.txid,
        "outputIndex" : utxos.vout[i].n,
        "address" : utxos.vout[i].scriptPubKey.addresses[0],
        "script":utxos.vout[i].scriptPubKey.hex,
        "satoshis" : parseInt(utxos.vout[i].value * 100000000)
      });
    }
    console.log("rec layer: ", 3);
    collect_utxoform(i+1);
    }
    if(i>=utxos.vout.length){
     console.log("rec layer: ", 4);
     let resp = errorSet.errorFunc("success", "Sending Array", uform);
     console.log("Resolving: Recursion ended. UtXo's are formatted. \n",resp)
     resolve (resp);
    }
   }
   collect_utxoform(0);
  }
  catch(e){
   let resp = errorSet.errorFunc("fail",e);
   console.log("Rejecting: Caught an error while trying to format UTxO's: ", resp);
   reject(resp);
  }
 });
}
//-o_O===exports===============================================~|
module.exports = {build_TxInputs};
//-o_0===fin====================================================|
