/*
Fees

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
const req_options = require('./request_options.js');
const res_fmt = require('./response_format.js');
const node_interface = require('./interface_request');

const digibyte = require ('digibyte');
const request = require('request');
const bodyParser = require('body-parser');
//-o_o===build-utxo==============================================|
let get = () => {
  return new Promise((resolve,reject)=>{
    try{
      const _body = {};
      req_options.build("interface",_body,"POST","/network_info")
      .then((options)=>{
        node_interface.req(options,"/network_info")
        .then((info)=>{
          const fee = parseInt(parseFloat(info.relayfee) * 100000000) + parseInt(237);
        //  console.log(`Fee before resolve ${fee}`);
          resolve(fee);
        })
        .catch((e)=>{
          reject(`Error obtaining network info: ${e}`);
        });
      })
      .catch((e)=>{
        reject(`Error obtaining network info: ${e}`);
      })
    }
    catch(e){
      console.log("Rejecting: error caught while trying to getnetworkinfo: ", e);
      reject(e);
    //retry?
    }
  });
}
//-o_O===exports===============================================~|
module.exports = {get};
//-o_0===fin====================================================|
