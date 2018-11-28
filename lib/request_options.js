/*
Options 

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===init======================================================|

//-o_o===build=====================================================|
let build = (destination,_params,_method,endpoint)=>{
  return new Promise((resolve,reject)=>{
    try{

      let options = {
        method: _method,
        url:"",
        headers:
        {
        "Content-Type": 'application/json'
        },
        body: _params,
        json: true
      };

      if (destination==="interface"){
        options.url = `http://localhost:${process.env.NI_PORT}${endpoint}`;
      }
      else if (destination==="multisig"){
        options.url = `http://localhost:${process.env.MSPORT}${endpoint}`;
      }
      else{
        options.url = destination;
      }
      //console.log(options);
      resolve(options); 
    }
    catch(e){
      console.log(`Errored while creating options for request to ${destination} : ${e}`);
      reject(e);
    }
  });
};
//-o_o===exports===================================================|
module.exports={build};
//-o_o===fin=======================================================|
