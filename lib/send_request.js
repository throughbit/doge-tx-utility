/*
Send Request 


Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const res_fmt = require('./response_format.js');
const req_options = require('./request_options.js');
const errors = require('./handle_errors.js');

const bodyParser = require('body-parser');
const request = require ('request');
//-o_o===init======================================================|
const _ep =`http://localhost:2020/send`;
//Example format
let send_orders = [
  {
    "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
    "amount":5000,
    "orderId":"TBDGB-9J298IJQ1231222113"
  },
  {
    "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
    "amount":5000,
    "orderId":"TBDGB-95T698IJQ123762352"
  },
  {
    "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
    "amount":5000,
    "orderId":"TBDGB-9KL98IJQ123621113213"
  }
  ];
//-o_o===req=======================================================|
let send_req = (send_orders)=>{
  return new Promise((resolve,reject)=>{  
    try{
      const _body = {"send_orders":send_orders};
      req_options.build(_ep,_body,"POST")
      .then((options)=>{
        request(options, (error,response,body)=>{
          if(error){
            reject(errors.handle(error));
          }
        console.log(body);
          if(body===undefined){
            let responso = res_fmt.create("false", body);
            reject(responso);
          }
          if(body.status){
            let responso  = res_fmt.create("true", body.message)
            resolve(responso);
          }
          else{
            let responso  = res_fmt.create("false", body.message)
            reject(responso);
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