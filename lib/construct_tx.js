/*
Digibyte Transaction Build & Broadcast

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project

*/
//-o_O===init===================================================~|
'use strict';
//-o_o===modules=================================================|
const signer = require('./sign');
const utxo = require('./inputs');
const loggit = require('./logs.js');
const errors = require('./handle_errors');
const fees = require('./fees.js');
const req_options = require('./options.js')
const node_interface = require('./interface_request');

const digibyte = require('digibyte');
const request = require('request');
const fs = require('fs');

//-o_o===BroadcastTx=============================================|
let build = (outputs,isMultiSig) => {
  return new Promise((resolve,reject)=>{
    try{
     //console.log(isMultiSig);
      let address=process.env.ADDR;
      let imported = process.env.WIF;

      if(isMultiSig){
        address=process.env.MSADDR;
        imported = process.env.MSPK1;
      }
      //get fee
      fees.get()
      .then((_fees)=>{
        const fee = _fees;
        utxo.build(address)
        .then((inputs)=>{
          //console.log(`Resolved inputs. Back at construct_tx: ${inputs}`);
          console.log(`Fees:${fee}`);
          signer.sign_tx(inputs,outputs,fee,address,imported,isMultiSig) //same input address used for change
          .then((hex)=>{
      //console.log("Resolving: response from build:\n",hex);
            resolve(hex); //SOLE RESOLUTION
          })
          .catch((e)=>{
            reject(e);
          });
        })//closes first utxo.build_TxInputs(txid).then().then()...
        .catch((e)=>{
          reject(e);
        });
      })
      .catch((e)=>{
        reject(errors.handle(e));
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
let broadcast = (hex)=>{
  return new Promise ((resolve,reject) => {
    try{
      //console.log("HEX:", hex);
      req_options.build("interface",{"hex":hex},"POST","/broadcastx")
      .then((options)=>{
        node_interface.req(options,"/broadcastx")
        .then((txid)=>{
          resolve(txid);
        })
        .catch((e)=>{
          reject(e);
        });
      })
      .catch((e)=>{
        reject(e);
      });
    }
    catch(e){
      console.log("Rejecting: Error from broadcast(hex)\n",e);
      reject(e);
      //retry
    }
  });
}
//-o_o===exports==========================================------||
module.exports={build,broadcast}
//-o_o===fin==============================================------||
