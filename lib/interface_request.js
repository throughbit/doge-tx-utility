/*
Interface Request

Response from interface contains:
{
status:
message:
}

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const bodyParser = require('body-parser');
const request = require ('request');
//-o_o===req=======================================================|
//req(options, endpoint_name for logs, response type)
let req = (options,ep_name)=>{
  return new Promise((resolve,reject)=>{
    try{
      //console.log(`Options at node request:\n${JSON.stringify(options)}`);

      request(options,(error,response,body)=>{
        if(error){
          reject(`Error in request to ${ep_name}.\n${error}`);
        }
        if(body===undefined){
          reject(`Undefined response body. Try again!`);
        }
        if(body.status){
          //console.log(body);
          resolve(body.message);
        }
        else{
          reject(`Error in request to ${ep_name}.\n${body.message}`);
        }
      });
    }
    catch(e){
      reject(`Error in request to ${ep_name}.\n${e}`);
    }
  });
}
//-o_o===exports===================================================|
module.exports={req};
//-o_o===fin=======================================================|
