/*
Error Handlers

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=======================================================|
const slack = require('./slack.js');
//-o_O===f(x)===================================================~|
let handle=(e)=>{
    if(e.cause){
      if(e.cause.code==="ECONNREFUSED"){
        slack.update("Daemon not running.","Node-Error");
        //console.log('Daemon not running');
        return 'Daemon not running';//does res.status(500) send response back under error?
      }
      else{
        //console.log(e.cause);
        return e.cause;
      }
    }

    else if (e.error){
      if (e.error.error){
        slack.update(e.error.error,"Node-Error");
        console.log(e.error.error);
        return e.error.error;
      }

      console.log(e.error);
      return e.error;
    }

    console.log(e);
    return e;
}
//-o_O===Exports================================================~|
module.exports = {handle};
//-o_O===fin====================================================~|
