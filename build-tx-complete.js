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
var fs = require('fs');
var errorSet = require('./errors.js');
const request = require('request');                         
//-o_o===/modules================================================|
//Obfuscate your pk even further than an env variable.
//However, since this module will be isolated form the internet, env should suffice
const WIF = process.env.WIF;
const imported = digibyte.PrivateKey.fromWIF(WIF).toString();
const changeAddress='DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW';
const fee=2000;
const NI_PORT = process.env.NI_PORT;
const digiurl = `http://localhost:${NI_PORT}/broadcastx`;
const LPATH = process.env.DSIGN_LPATH;
//-o_o===SignTx==================================================|
function sign_tx (inputs,outputs,fee,change,pk){
 return new Promise((resolve,reject)=>{
  try{
   //console.log(inputs,outputs,fee,change);
   var transaction = new digibyte.Transaction().fee(fee);
   
   transaction.from(inputs);
    
   let tx_to = function(i){
    if(i < outputs.length){
      
     transaction.to(outputs[i].address,outputs[i].amount);
    // console.log("TxOutput: " , i);
     //holdup.wait(outputs.length * 100);
     tx_to(i+1);
    }
    else if (i >= outputs.length) {
     console.log("BEFORE HEXX");
      
     transaction.change(change)
     .sign(pk);
      
     let hex = transaction.serialize();
     
     console.log("HEXX", hex);
      
     let log_data={
      "time":new Date().getTime(),
      "status": "success",
      "message": "Transactions have been signed.", 
      "transaction_outputs": outputs,
      "transaction_inputs": inputs,
      "hex":transaction
     }
     let log_separator = "#--------------------------------------------------------------------------------------------------------------- ";
     
     fs.appendFile(`${LPATH}`,`${JSON.stringify(log_data,null,1)}\n${log_separator}\n`, function(err){
      if(err) console.log("Could not write to file: \n", err);
      else console.log(`Notification logged @ ${log_data.time}. Check ${LPATH}.`);
     });
     
     let response = errorSet.errorFunc("success", hex); 
     resolve (response);
    }
   }
   tx_to(0);
  }
  catch(e){
   let errorDetail=`Rejecting: Caught error at sign_tx() \nErrorDetail: ${e}`;
   let response = errorSet.errorFunc("fail", errorDetail);
   let log_data={
    "time":new Date().getTime(),
    "status": "fail",
    "message":`Error signing transactions.\nError: ${e}`,
    "transaction_outputs": outputs,
    "transaction_inputs": inputs
    //next level: split addresses from amounts.
    //see if this runs for now
   }
   let log_separator = "#--------------------------------------------------------------------------------------------------------------- ";

   fs.appendFile(`${LPATH}`,`${JSON.stringify(log_data,null,1)}\n${log_separator}\n`, function(err){
    if(err) console.log("Could not write to file: \n", err);
    else console.log(`Notification logged @ ${log_data.time}. Check ${LPATH}.`);
   });
   
  // console.log(response);
   reject (response);
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
    .then((inputs)=>{
    if(inputs.status){
     sign_tx(inputs.message_array,outputs,fee,changeAddress,imported)
     .then((hex)=>{
      if(hex.status){ 
       broadcast_to_node(hex.message.toString())
       .then((response)=>{
        if(response.status){
         console.log("Resolving: response from broadcast_to_node:\n",response.message);
         let resp = errorSet.errorFunc("success", response.message);
         resolve(resp);
        }
        else if(!response.status){
         console.log("Rejecting: response from broadcast_to_node: \n", response.message);
         let resp = errorSet.errorFunc("success", response.message);
         reject(resp);
        }
       });//broadcast_to_node().then();
      }//clost if hex.status 
      else if(!hex.status){
       let resp = errorSet.errorFunc("fail", hex.message);
       console.log("Rejecting: Error in broadcast_tx() from Hex status promised by sign_tx()\n", hex.message);
       reject(resp);
      }
     });//sign_tx().then();
    }//close if inputs.status 
    else if(!inputs.status){
     let resp = errorSet.errorFunc("fail", inputs.message);
     console.log("Rejecting: Error in broadcast_tx() from Inputs status promised by utxo.get_Inputs()\n", inputs.message);
     reject(resp);
    }
   })//closes first utxo.build_TxInputs(addresses).then()...
    .catch((err)=>{
   
     if(!err.status){
      let resp = errorSet.errorFunc("fail",err.message);
      console.log("0 Rejecting: Caught error in broadcast_tx()", resp);
      reject(resp);
     }
     else{
      let resp = errorSet.errorFunc("fail", JSON.stringify(err));
      console.log("1 Rejecting: Caught error in broadcast_tx()", resp);
      reject(resp);
     }
    });//closes utxo.build_TxInputs(addresses).then().catch();
   }//close main try
   //final catch
   catch(e){
    let resp = errorSet.errorFunc("fail", e);
    console.log("Rejecting: Caught error in broadcast_tx()\nFinal Catch: We should not have got here..\n", resp);
    reject(resp);
   }
 });//close promise resolve
}
//-o_o===BroadcastTx=============================================|
function broadcast_to_node (hex){
 return new Promise ((resolve,reject) => {
  try{
   console.log("HEX:", hex);
   let options = {
      headers:{ "content-type": "application/JSON" },
      url: digiurl,
      method: 'POST',
      body:{"hex":hex},
      json: true
   }
   request(options,(error, response, body)=>{
    if(error){
     let resp = errorSet.errorFunc("fail", error);
     console.log("Rejecting: Error from request made from broadcast_to_node. \n", error);
     reject (resp);
    }
    if(body.status){
     console.log("Resolving: Got successful body from request made from broadcast_to_node. \n",body);
     let resp = errorSet.errorFunc("sucess", body.result);
     resolve (resp);
    }
    if(!body.status){
     let resp = errorSet.errorFunc("fail", body.result.message);
     console.log("Rejecting: Got failed body from request made from broadcast_to_node. \n", body.result.message);
     reject (resp);
    }
   });
  }
  catch(e){
   let resp = errorSet.errorFunc("fail", e);
   console.log("Rejecting: Error from broadcast_to_node(hex)\n",e);
   reject(resp);
  }
 });
}
//-o_o===exports==========================================------||
module.exports={broadcast_tx}
//-o_o===fin==============================================------||
