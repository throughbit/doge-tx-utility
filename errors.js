/*
errors
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O============================================================~|
'use strict';

function errorFunc(type,msg){

 var fail = {
 "default": "Error",
 "badIn": "Bad inputs. Check formats.",
 "fcatch": "Final catch",
 "badReq": "Bad Request.",
 "auth": "Authorization failure",
 "addr": "Invalid Address",
 "amt": "Invalid Amount",
 "limit": "Send amount over limit.",
 "amt": "Amount below zero.",
 "NaN": "Not a Number.",
 };
 var success = {
 "privkey": "Generated Private Key",
 "pubaddr": "Generated Public Addresses"
 };
 var fail_response = {
 "status": "0",
 "message": "Operation Failed."
 };
 var success_response = {
 "status": "1",
 "message": "Great Success."
 };

 if(type==='fail'){
  let response = fail_response;
   if(fail[msg]===undefined || fail[msg]===null) { response.message = msg; }
   else { response.message = fail[msg]; }
  return response;
 }

 if(type==='success'){
  let response = success_response;
   if(success[msg]===undefined || success[msg]===null) { response.message = msg; }
   else { response.message = success[msg]; }
  return response;
 }

}
//-o_O===Exports================================================~|
module.exports = {errorFunc};
//-o_O===fin====================================================~|
