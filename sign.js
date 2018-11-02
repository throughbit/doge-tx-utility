
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
const logs = require('./logs.js');
const res_fmt = require('./response_format.js');
//-o_o===/modules================================================|
//-o_o===SignTx==================================================|
function sign_tx (inputs,outputs,fee,change,privatekey){
  return new Promise((resolve,reject)=>{
    try{
      console.log(`Here to sign:\n Inputs: ${inputs[0].satoshis}\n,Outputs: ${outputs}\nFee: ${fee}\nChange: ${change}\nPrivatekey: shh.`);
      
      console.log("Individual Inputs:");
      inputs.map((elem)=>{
        console.log(elem.satoshis);
      })
      //Total balance in utxo
      const balance = inputs.reduce((accumulated,each)=>{
        return {satoshis: each.satoshis + accumulated.satoshis};        
      });
      const threshold = 100000000000;//1000 DGB
   
      console.log(`Total spending balance: ${balance.satoshis}`);
      if(balance.satoshis<=threshold){
        //notify
        console.log("Total spending balance is below threshold!");
        
      }

      const pk = new digibyte.PrivateKey.fromWIF(privatekey);
      var transaction = new digibyte.Transaction().fee(fee);

      transaction.from(inputs);
      
      //-------------------------Outputs---------------------------------
      //Can this be done as transaction.to(outputs); ?
      let tx_outputs = function(i){
        if(i < outputs.length){ //more outputs left
          transaction.to(outputs[i].address,outputs[i].amount);
          tx_outputs(i+1);
        }
        else if (i >= outputs.length) { //all outputs completed
          transaction.change(change)
          .sign(pk);

          let hex = transaction.serialize();
          //console.log("HEXX", hex);
          let log_data = {
            "status":true,
            "message": "Outputs have been successfully signed",
            "outputs":outputs,
            "inputs":inputs,
            "hex":hex
          }
          logs.write_sign(true,log_data);
        //think about how to use this log incase broadcast fails
          let response = res_fmt.create(true, hex);
        //console.log("POST SIGN: ",response);
          resolve (response);
        }
      }
      
      tx_outputs(0);
    }
    catch(e){
      let errorDetail=`Rejecting: Caught error at sign_tx() \nErrorDetail: ${e}`;
      console.log(errorDetail);
      let log_data = {
        "status": false,
        "message": "Outputs have not been signed.",
        "outputs":outputs,
      };
      logs.write_sign(false,log_data);
      reject (e);
    //think about a better strategy to deal with an unsuccessful sign.
    //possibly call a waiter function that retries after a certain period, based on the error type.
    //Definately notify slack.
    }
  });
}
//-o_o===exports==========================================------||
module.exports={sign_tx}
//-o_o===fin==============================================------||
