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
const res_fmt = require('./response_format.js');
const errors = require('./handle_errors');

//-o_o===BroadcastTx=============================================|
function build(outputs){
  return new Promise((resolve,reject)=>{
    try{
      const address=process.env.ADDR;
      const imported = process.env.WIF;
      const changeAddress=address;
      const fee=4000;
      //variable fee
      //This es le address with happy utxo 
      //read addresses from a file or env?
      //console.log("OUTPUTS: \n",outputs);
      //fix this and inputs.js to allow passing multiple input addresses?
      utxo.build_tx_inputs(address)
      .then((inputs)=>{
       // console.log(inputs);
        signer.sign_tx(inputs.message,outputs,fee,changeAddress,imported)
        .then((hex)=>{
          //console.log("Resolving: response from build:\n",hex.message);
          let resp = res_fmt.create(true, hex.message);
          resolve(hex); //SOLE RESOLUTION
        })
        .catch((e)=>{
          reject(e);
        });
      })//closes first utxo.build_TxInputs(txid).then().then()...
      .catch((e)=>{
        reject(e);
      });
    }//close main try
  //final catch
    catch(e){
      reject(e);
    //consider:- holdup.wait(10000); broadcast_tx(outputs);
    }
  });//close promise resolve
}
//-o_o===BroadcastTx=============================================|
function broadcast(hex){
  return new Promise ((resolve,reject) => {
    try{
      //console.log("HEX:", hex);
      const digiurl = `http://localhost:${process.env.NI_PORT}/broadcastx`;
      let options = {
        headers:{ "content-type": "application/JSON" },
        url: digiurl,
        method: 'POST',
        body:{"hex":hex},
        json: true
      }
      request(options,(error, response, body)=>{
        if(error){
          let resp = res_fmt.create("fail", error);
          console.log("Rejecting: Error from request made from broadcast_to_node. \n", error);
          reject (error);
          //retry?
        }
       // console.log("BODY FROM broadcast_to_node request" ,body);
        if(body.status){//since this returns from a res.send we must check status.
                  //errors will not be automatically thrown into error in all cases.
          let resp = res_fmt.create(true, body.message);
          //console.log("Resolving: Got successful body from request made from broadcast_to_node. \n",resp);
          resolve (resp);
        }
        if(!body.status){
          let resp = res_fmt.create("fail", body.message);
          console.log("Rejecting: Got failed body from request made from broadcast_to_node. \n", resp);
          reject (resp);
        //retry?
        }
      });
    }
    catch(e){
      console.log("Rejecting: Error from broadcast_to_node(hex)\n",e);
      reject(e);
      //retry
    }
  });
}
//-o_o===exports==========================================------||
module.exports={build,broadcast}
//-o_o===fin==============================================------||
