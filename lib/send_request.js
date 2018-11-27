/*
Send Request 

***REQUEST FORMAT:
 send_orders = [
    {
      "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
      "amount":5000,
      "orderId":"TBDGB-9J298IJQ12312221"
    },
    {
      "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
      "amount":5000,
      "orderId":"TBDGB-95T698IJQ12376222"
    },
    {
      "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
      "amount":5000,
      "orderId":"TBDGB-9KL98IJQ123621113"
    }
    ];

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

let send_orders = [
  {
    "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
    "amount":5000,
    "orderId":"TBDGB-9J298IJQ12312221"
  },
  {
    "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
    "amount":5000,
    "orderId":"TBDGB-95T698IJQ12376235"
  },
  {
    "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
    "amount":5000,
    "orderId":"TBDGB-9KL98IJQ12362111321"
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
          if(body.status){
            let responso  = res_fmt.create("true", body)
            resolve(responso);
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