/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Digibyte Transaction Builder
Builds a raw transaction and broadcasts to a remote node
*/
//-o_O===init===================================================~|
'use strict';
//-o_o===modules=================================================|
const digibyte = require('digibyte');
const request = require('request');
const fs = require('fs');

const signer = require('./sign');
const utxo = require('./inputs');
const txS = require('./outputs');
const loggit = require('./logs.js');
const errorSet = require('./errors.js');
//-o_o===/modules================================================|
//Obfuscate your pk even further than an env variable.
//However, since this module will be isolated form the internet, env should suffice
const WIF = process.env.WIF;
const imported = digibyte.PrivateKey.fromWIF(WIF);
const temp = '';
const changeAddress='DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW';
const fee=2000;
const NI_PORT = process.env.NI_PORT;
const digiurl = `http://localhost:${NI_PORT}/broadcastx`;
//-o_o===BroadcastTx=============================================|
function broadcast_tx(outputs){
 return new Promise((resolve,reject)=>{
  try{
   const addresses=['DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW'];
   //read addresses from a file
   console.log("OUTPUTS: \n",outputs);
   utxo.build_TxInputs(addresses)
   .then((inputs)=>{
    signer.sign_tx(inputs.message_array,outputs,fee,changeAddress,imported)
    .then((hex)=>{
     // if(hex.status){
     broadcast_to_node(hex.message.toString())
     .then((response)=>{
       console.log("Resolving: response from broadcast_to_node:\n",response.message);
       let resp = errorSet.errorFunc("success", response.message);
       resolve(resp); //SOLE RESOLUTION
     })
     .catch((err)=>{
      let response = errorSet.errorFunc("fail", err.message);
      console.log("Caught at the deepest in broadcast_tx() @ broadcast_to_node().\nWas expecting txid.", response);
      reject(response);
     })
    })//closes first utxo.build_TxInputs(txid).then().then()...
    .catch((err)=>{
     let response = errorSet.errorFunc("fail", err.message);
     console.log("Caught in broadcast_tx() @ sign_tx().\nWas expecting hex.", response);
     reject(response);
    })
   })//closes utxo.build_TxInputs(txid).then();
   .catch((err)=>{
    let response = errorSet.errorFunc("fail", err.message);
    console.log("Caught in broadcast_tx() @ build_TxInputs().\nWas expecting inputs.", response);
    reject(response);
   });
  }//close main try
  //final catch
  catch(e){
   let resp = errorSet.errorFunc("fail", e);
   console.log("Rejecting: Caught error in broadcast_tx()\nFinal Catch: We should not have got here..\n", resp);
   reject(resp);
   //consider:- holdup.wait(10000); broadcast_tx(outputs);
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
     //retry?
    }
    console.log("BODY FROM broadcast_to_node request" ,body);
    if(body.status){//since this returns from a res.send we must check status.
                    //errors will not be automatically thrown into error in all cases.
     let resp = errorSet.errorFunc("success", body.message);
     console.log("Resolving: Got successful body from request made from broadcast_to_node. \n",resp);
     resolve (resp);
    }
    if(!body.status){
     let resp = errorSet.errorFunc("fail", body.message);
     console.log("Rejecting: Got failed body from request made from broadcast_to_node. \n", resp);
     reject (resp);
     //retry?
    }
   });
  }
  catch(e){
   let resp = errorSet.errorFunc("fail", e);
   console.log("Rejecting: Error from broadcast_to_node(hex)\n",resp);
   reject(resp);
   //retry
  }
 });
}
//-o_o===exports==========================================------||
module.exports={broadcast_tx}
//-o_o===fin==============================================------||
