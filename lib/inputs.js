/*
Inputs

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project

*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
const digibyte = require ('digibyte');
const request = require('request');
const bodyParser = require('body-parser');

const res_fmt = require('./response_format.js');
//Link all addresses to the remote node using importaddress for /get_utxo(listunspent) to work
//-o_o===build-utxo==============================================|
let  build = (addresses) => {
  return new Promise((resolve,reject)=>{
    try{
      const NI_PORT = process.env.NI_PORT;
      const utxo_endpoint = `http://localhost:${NI_PORT}/get_utxo`;
      
      let options = {
        headers:{"content-type":"application/JSON"},
        url: utxo_endpoint,
        method: 'POST',
        body:{"addresses":addresses},
        json: true
      }

      console.log("Options passed to /get_utxo request: ", options);

      request(options, (error, response, body)=>{
        if(error){
          let resp = res_fmt.create(false,`undefined body in response from /get_utxo\N${error}`);
          reject (resp);
        //retry?
        }
        if(body===undefined){
          let resp = res_fmt.create(false,"undefined body in response from /get_utxo");
          reject (resp);
        }
        //console.log("BODY FROM get_utxo: ",body);
        if(body.status){
          console.log("Request to /get_utxo returned body: ",body.message.result);
          let utxo_set=body.message.result;

          format(utxo_set)
          .then((formatted)=>{
              let resp = res_fmt.create(true, formatted.message);
              //console.log("Resolving: Utxo's have  been formatted: ", resp);
              resolve (resp);
          })
          .catch((e)=>{
            console.log(`Caught at /get_utxo request\n${e}`);
            let resp = res_fmt.create(false,`undefined body in response from /get_utxo\N${e}`);
            reject(resp);
          });
        }
        //
        //IS THIS REQUIRED + COULD THIS CAUSE ISSUES
        else{
          let resp = res_fmt.create(false,`Error in response from /get_utxo\n${body.message}`);
          reject (resp);
        }
  
      });//close the request
    }
    catch(e){
    console.log("Rejecting: error caught while trying to build_tx_inputs: ", e);
    reject(e);
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
let format=(utxos)=>{
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

      //console.log("HERE TO FORMAT: \n",utxos);
      let format = function(i){
        if(i < utxos.length){//more utxos to format
          uform.push({
            "txId":utxos[i].txid,
            "outputIndex":utxos[i].vout,
            "address":utxos[i].address,
            "script":utxos[i].scriptPubKey,
            "satoshis":parseInt(utxos[i].amount * 100000000)
          });
          format(i+1);
        }
        if(i>=utxos.length){ //all utxos formatted
          let resp = res_fmt.create(true, uform);
          //console.log("Resolving: Recursion ended. UtXo's are formatted. \n",resp)
          resolve (resp);
        }
      }
      format(0);
    }
    catch(e){  
      console.log("Rejecting: Caught an error while trying to format UTxO's: ", e);
      reject(e);
    }
  });
  }
//-o_O===exports===============================================~|
module.exports = {build};
//-o_0===fin====================================================|
