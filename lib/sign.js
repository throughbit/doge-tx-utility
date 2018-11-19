
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
const request = require('request');
const logs = require('./logs.js');
const res_fmt = require('./response_format.js');
const req_options = require('./request_options')
//-o_o===/modules================================================|
//-o_o===SignTx==================================================|
let sign_tx = (inputs,outputs,fee,change,privatekey,isMultiSig) => {
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

      let transaction = new digibyte.Transaction().fee(fee);
      let pk = "";
      let pubk_array = new Array();

      if(isMultiSig){
        const pubkeys = process.env.MSPUBKS;
        pk = process.env.MSPK1;
        pubk_array = pubkeys.split(",");
     
        console.log(pubk_array);
        transaction.from(inputs,pubk_array,2);
      }
      else{
        pk = new digibyte.PrivateKey.fromWIF(privatekey);
        transaction.from(inputs);
      }
      //-------------------------Outputs---------------------------------
      //Can this be done as transaction.to(outputs); ?
      let tx_outputs = (i)=>{
        if(i < outputs.length){ //more outputs left
          transaction.to(outputs[i].address,outputs[i].amount);
          tx_outputs(i+1);
        }
        if (i >= outputs.length) { //all outputs completed
          transaction.change(change)
          .sign(pk);

          if(isMultiSig){
            let serialized = transaction.toObject();

            console.log(`Before signing: ${serialized}`);
            req_options.build("multisig",serialized,"/","GET")
            .then((options)=>{
              request(options,(error,response,body)=>{
                if(error){
                  console.log("Rejecting: Error in getting obtaining signature from multisig server.", error);
                  reject(error);
                }
               
                let log_data = {
                  "status":true,
                  "message": "Outputs have been successfully signed",
                  "outputs":outputs,
                  "inputs":inputs,
                  "hex":body.messsage
                }
                logs.write_sign(true,log_data);
                
                console.log(`After signing: ${body}`);
                let tx = new digibyte.Transaction(body);
                let resp = res_fmt.create(true,tx.serialize());
                resolve(resp);
              });
            });
          }

          else{
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
