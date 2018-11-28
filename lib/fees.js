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
        
          if(body===undefined){
            reject(`Undefined body`);
          }
          if(body.status){
            console.log(`Body from get_fee at construct_tx:\n${JSON.stringify(body)}`);
            const fee = parseInt(parseFloat(body.message.result.relayfee) * 100000000) + parseInt(237);
            console.log(`Fee before resolve ${fee}`);
            resolve(fee);
          }
          else{
            console.log(`Error getting network info\n${body}`);
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
      console.log("Rejecting: error caught while trying to get_networkinfo: ", e);
      reject(e);
    //retry?
    }
  });
}
//-o_O===exports===============================================~|
module.exports = {get};
//-o_0===fin====================================================|
