'use strict';
//-o_O===modules===================================================~|
const fs = require('fs');
//-o_O===init======================================================~|
//-o_O===sign_tx()=================================================~|
function write_sign_log(status,data){
 const LPATH = process.env.DSIGN_LPATH;
//status is a bool
//data is an object
 const time = new Date().getTime();

 var s_log={
  "time":time,
  "status": "success",
  "message": "Transactions have been signed.",
  "transaction_outputs": data.outputs,
  "transaction_inputs": data.inputs,
  "hex":data.hex
 }

 var f_log={
  "time":time,
  "status": "fail",
  "message":`Error signing transactions.`,
  "transaction_outputs": data.outputs,
  "transaction_inputs": data.inputs
  //next level: split addresses from amounts.
  //see if this runs for now
}
 var log_separator = "#--------------------------------------------------------------------------------------------------------------- ";
 if(status){
 fs.appendFile(`${LPATH}`,`${JSON.stringify(s_log,null,1)}\n${log_separator}\n`, function(err){
   if(err) console.log("Could not write to file: \n", err);
   else console.log(`Notification logged @ ${time}. Check ${LPATH}.`);
  });
 }
 else{
  fs.appendFile(`${LPATH}`,`${JSON.stringify(f_log,null,1)}\n${log_separator}\n`, function(err){
   if(err) console.log("Could not write to file: \n" , err);
   else console.log(`Notification logged @ ${time}. Check ${LPATH}.`);
 });
 }
}
//-o_O===exports===================================================~|
module.exports={write_sign_log};
//-o_O===fin-======================================================~|
