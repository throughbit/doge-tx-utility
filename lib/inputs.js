/*
Inputs

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project

*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
const req_options = require('./options.js');
const node_interface = require('./interface_request');
//Link all addresses to the remote node using importaddress for /get_utxo(listunspent) to work
//-o_o===build-utxo==============================================|
let build = (addresses) => {
  return new Promise((resolve,reject)=>{
    try{
      const NI_PORT = process.env.NI_PORT;
      req_options.build("interface",{"addresses":addresses},"POST","/get_utxo")
      .then((options)=>{
        //console.log(`get_utxo Options: ${JSON.stringify(options)}`);
        node_interface.req(options,"/get_utxo")
        .then((inputs)=>{
          //console.log(`Inputs: ${inputs}`);
          let utxo_set=inputs;
          format(utxo_set)
          .then((formatted)=>{
            //console.log("Resolving: Utxo's have  been formatted: ", formatted);
            resolve (formatted);
          })
          .catch((e)=>{
            reject(`Error formatting utxo_set`);
          });
        })
        .catch((e)=>{
          reject(`Error fetching inputs from /get_utxo`);
        });
      })
      .catch((e)=>{
        reject(`Error building options for request to /get_utxo`);
      });
    }
    catch(e){
    //console.log("Rejecting: error caught while trying to build utxo_set: ", e);
     reject(`Error building utxo_set: ${e}`);
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
      let uform = new Array();

      //console.log("HERE TO FORMAT: \n",utxos);
      let format = (i)=>{
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
          //console.log("Resolving: Recursion ended. UtXo's are formatted. \n",uform)
          resolve (uform);
        }
      }
      format(0);
    }
    catch(e){  
      //console.log("Rejecting: Caught an error while trying to format UTxO's: ", e);
      reject(`Error formatting utxo_set: ${e}`);
    }
  });
  }
//-o_O===exports===============================================~|
module.exports = {build};
//-o_0===fin====================================================|
