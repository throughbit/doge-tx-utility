/*
errors
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=======================================================|
const res_fmt = require('./response_format.js');
const serialize_error = require('serialize-error');
//-o_O===f(x)===================================================~|
let handle=(e)=>{  
    if(e.cause){
      if(e.cause.code==="ECONNREFUSED"){
      //slack notify?
        let response = res_fmt.create(false,serialize_error(new Error('Daemon not running')));
        console.log(response);
        return response;//does res.status(500) send response back under error?
      }
      else{
        let response = res_fmt.create(false,serialize_error(new Error(e.cause)));
        console.log(response);
        return response;
      }
    }
    else if (e.error){
      if (e.error.error){
        let response = res_fmt.create(false,serialize_error(new Error(e.error.error.message)));
        console.log(response);
        return response;
      }
      else{
        let response = res_fmt.create(false,serialize_error(new Error(e.error)));
        console.log(response);
        return response;
      }
    }
    else{
      let response = res_fmt.create(false,serialize_error(new Error(e)));
      console.log(response);
      return response;
    }

}
//-o_O===Exports================================================~|
module.exports = {handle};
//-o_O===fin====================================================~|
