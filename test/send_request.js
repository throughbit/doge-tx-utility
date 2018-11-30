/*
Send Request 


Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const res_fmt = require('../lib/response_format.js');
const req_options = require('../lib/options.js');
const errors = require('../lib/handle_errors_serialized.js');

const bodyParser = require('body-parser');
const request = require ('request');
//-o_o===init======================================================|
const _ep =`http://localhost:${process.env.L_PORT}/send`;
//Example format
console.log(_ep);
let send_orders = [
  {
    "address": "DDzvD6JoaHFTubzfPoKf7m8dfp9quKD1dJ",
    "amount":5000,
    "orderId":"TBDGB-9J29"
  },
  {
    "address": "DRjtBctsX1Yive8TyyTrGHK57eUV9UujHx",
    "amount":5000,
    "orderId":"TBDGB-95T6"
  },
  {
    "address": "DDQrE3xVgYjcgFdL8xsPWtutsYJxc7gLN4",
    "amount":5000,
    "orderId":"TBDGB-9KL9"
  }
  ];
//-o_o===req=======================================================|
let send_req = (send_orders)=>{
  return new Promise((resolve,reject)=>{  
    try{
      const _body = {"send_orders":send_orders};
      req_options.build(_ep,_body,"POST")
      .then((options)=>{
        //console.log(`Built options:${JSON.stringify(options)}`)
        request(options, (error,response,body)=>{
          if(error){
            reject(errors.handle(error));
          }
        console.log(body);
          if(body===undefined){
            reject(res_fmt.create("false", `Got undefined body from request to ${_ep}`));
          }
          if(body.status){
            resolve(res_fmt.create("true", body.message));
          }
          else{
            reject(res_fmt.create("false", body.message));
          }
        });
      })
      .catch((e)=>{
        reject(errors.handle(e));
      });
    }
    catch(e){
      reject(errors.handle(e));
    };
  });
}
//-o_o===exports===================================================|
module.exports={send_req};
//-o_o===fin=======================================================|
send_req(send_orders);