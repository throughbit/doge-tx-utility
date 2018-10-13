/*
errors
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O============================================================~|
'use strict';

function errorFunc(type,msg,msg_arr){ 
 var fail_response = {
 "status": false,
 "message": "",
 "message_array":[]
 };
 var success_response = {
 "status": true,
 "message": "",
 "message_array":[]
 };

 if(type==='fail'){
  let response = fail_response;
  response.message = msg;
  response.message_array = msg_arr;
  return response;
 }

 if(type==='success'){
  let response = success_response;
  response.message = msg; 
  response.message_array = msg_arr;
  return response;
 }

}
//-o_O===Exports================================================~|
module.exports = {errorFunc};
//-o_O===fin====================================================~|
