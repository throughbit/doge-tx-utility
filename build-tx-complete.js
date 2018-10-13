/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Digibyte Transaction Builder
Builds a raw transaction and signs offline.
Broadcasts to a remote node - preferably over a local network to isolate keys from the internet
*/
//-o_O===init===================================================~|
'use strict';
//-o_o===modules=================================================|
const digibyte = require('digibyte');
const utxo = require('./build-tx-inputs');
const txS = require('./build-tx-outputs');
const broadcaster = require('./Broadcaster');
const holdup = require('./wait');
var fs = require('fs');
//-o_o===/modules================================================|
//Obfuscate your pk even further than an env variable.
//However, since this module will be isolated form the internet, env should suffice
const WIF = process.env.WIF;
const imported = digibyte.PrivateKey.fromWIF(WIF).toString();
const changeAddress='DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW';
const fee=2000;
const digiurl = `http://localhost:${NI_PORT}/broadcastx`;
const LPATH = process.env.DSIGN_LPATH;

//-o_o===SignTx==================================================|
function sign_tx (inputs,outputs,fee,change,pk){
 return new Promise((resolve,reject)=>{
  try{
   //console.log(inputs,outputs,fee,change);
   var transaction = new digibyte.Transaction();
   transaction.from(inputs);
   let tx_to = function(i){
    if(i < outputs.length){
     transaction.to(outputs[i].address,outputs[i].amount);
    // console.log("TxOutput: " , i);
     //holdup.wait(outputs.length * 100);
     tx_to(i+1);
    }
    else if (i >= outputs.length) {
     transaction.fee(fee)
     .change(change)
     .sign(pk);
    
     let log_data={
      "time":Date.getTime(),
      "status": "success",
      "message": Transactions have been signed. 
      "transaction_outputs": outputs
      "hex":transaction
     }
     let log_separator = "#--------------------------------------------------------------------------------------------------------------- ";
     
     fs.appendFile(`${LPATH}`,`${JSON.stringify(log_data,null,1)}\n${log_separator}\n`, function(err){
      if(err) console.log("Could not write to file: \n", err);
      else console.log(`Notification logged @ ${log_data.time}. Check ${LPATH}.`);
     });
     resolve (transaction);
    }
   }
   tx_to(0);
  }
  catch(e){
   console.log("Rejecting: Caught error at sign_tx()",e);
   
   let log_data={
    "time":Date.getTime(),
    "status": "fail",
    "message":`Error signing transactions.\nError: ${e}`,
    "transaction_outputs": outputs
    //next level: split addresses from amounts.
    //see if this runs for now
   }
   let log_separator = "#--------------------------------------------------------------------------------------------------------------- ";

   fs.appendFile(`${LPATH}`,`${JSON.stringify(log_data,null,1)}\n${log_separator}\n`, function(err){
    if(err) console.log("Could not write to file: \n", err);
    else console.log(`Notification logged @ ${log_data.time}. Check ${LPATH}.`);
   });
   
   reject (e);
  }
 });
}
//-o_o===BroadcastTx=============================================|
function broadcast_tx(outputs){
 return new Promise((resolve,reject)=>{
  try{
   const addresses=["DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW"];
   //read addresses from a file
   console.log("OUTPUTS: \n",outputs);
   utxo.build_TxInputs(addresses)
    .then(inputs=>sign_tx(inputs,outputs,fee,changeAddress,imported)
     .then((hex)=>{
      //console.log("Transaction Signed: ",hex);
     //colliding function names. the broadcast_tx below is being exported from broadcast ;)
      broadcaster.broadcast_to_node(hex.toString())
      .then((response)=>{
       console.log("Resolving: response from broadcast_to_node:\n",response);
       resolve(response);
      })
     })
    )//closes first utxo.build_TxInputs(addresses).then(...
    .catch((e)=>{
     console.log("Rejecting: Error in broadcast_tx()",e);
     reject(e);
    })
   }
   catch(e){
    console.log("Rejecting: Error in broadcast_tx()",e);
    reject (e);
   }
 });
}
//-o_o===BroadcastTx=============================================|
function broadcast_to_node (hex){
 return new Promise ((resolve,reject) => {
  try{
   //console.log("HEX:", hex);
   let options = {
      headers:{ "content-type": "application/JSON" },
      url: digiurl,
      method: 'POST',
      body:{"hex":hex},
      json: true
   }
   request(options,(error, response, body)=>{
    if(error){
     console.log("Rejecting: Error from request made from broadcast_to_node. \n", error);
     reject (error);
    }
    console.log("Resolving: Got  body from request made from broadcast_to_node. \n",body);
    resolve (body.result);
   });
  }
  catch(e){
   console.log("Rejecting: Error from broadcast_to_node(hex)\n",e);
   reject(e);
  }
 });
}
//-o_o===exports==========================================------||
module.exports={broadcast_tx}
//-o_o===fin==============================================------||
