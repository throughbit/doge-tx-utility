
/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Digibyte Transaction Signer
Signs a transaction and returns a hex for broadcasting
*/
//-o_O===init===================================================~|
'use strict';
//-o_o===modules=================================================|
const digibyte = require('digibyte');
const loggit = require('./logs.js');
const errorSet = require('./errors.js');
//-o_o===/modules================================================|
//-o_o===SignTx==================================================|
function sign_tx (inputs,outputs,fee,change,privatekey){
 return new Promise((resolve,reject)=>{
  try{
   //console.log(inputs,outputs,fee,change);
   const pk = new digibyte.PrivateKey.fromWIF(privatekey);
   var transaction = new digibyte.Transaction().fee(fee);

   transaction.from(inputs);
//-------------------------Outputs---------------------------------
//Can this be done as transaction.to(outputs); ?
   let tx_to = function(i){
    if(i < outputs.length){
     transaction.to(outputs[i].address,outputs[i].amount);
    // console.log("TxOutput: " , i);
     //holdup.wait(outputs.length * 100);
     tx_to(i+1);
    }
    else if (i >= outputs.length) {
    // console.log("BEFORE HEXX");
     transaction.change(change)
     .sign(pk);

     let hex = transaction.serialize();
     //console.log("HEXX", hex);
     let log_data = {
      "outputs":outputs,
      "inputs":inputs,
      "hex":hex
     }
     loggit.write_sign_log(true,log_data);
     //think about how to use this log incase broadcast fails
     let response = errorSet.errorFunc("success", hex);
     //console.log("POST SIGN: ",response);
     resolve (response);
    }
   }
   tx_to(0);
  }
  catch(e){
   let errorDetail=`Rejecting: Caught error at sign_tx() \nErrorDetail: ${e}`;
   let response = errorSet.errorFunc("fail", errorDetail);
   // console.log(response);
   let log_data = {
      "outputs":outputs,
      "inputs":inputs,
     };
   loggit.write_sign_log(false,log_data);
   reject (response);
  //think about a better strategy to deal with an unsuccessful sign.
  //possibly call a waiter function that retries after a certain period, based on the error type.
  //Definately notify slack.
  }
 });
}
//-o_o===exports==========================================------||
module.exports={sign_tx}
//-o_o===fin==============================================------||
