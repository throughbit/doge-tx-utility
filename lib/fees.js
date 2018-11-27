/*
Fees

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
const digibyte = require ('digibyte');
const request = require('request');
const bodyParser = require('body-parser');

const req_options = require('./request_options.js');
const res_fmt = require('./response_format.js');
//Link all addresses to the remote node using importaddress for /get_utxo(listunspent) to work
//-o_o===build-utxo==============================================|
let get = () => {
  return new Promise((resolve,reject)=>{
    try{
      const _body = {};
      req_options.build("interface",_body,"POST","/network_info")
      .then((options)=>{
        request(options, (error,response,body)=>{
          if(error){
            reject(error);
          }
        console.log(body);
          if(body.status){
            const fee = parseInt(parseFloat(body.message.relayfee) * 100000000);
            resolve(fee);
          }
          else{
            console.log(`Error getting network info`);
            reject(body);
          }
        });
      })
      .catch((e)=>{
        console.log(`Error: ${e}`);
        reject(e);
      })
    }

    catch(e){
      console.log("Rejecting: error caught while trying to build_tx_inputs: ", e);
      reject(e);
    //retry?
    }
  });
}
//-o_O===exports===============================================~|
module.exports = {get};
//-o_0===fin====================================================|
