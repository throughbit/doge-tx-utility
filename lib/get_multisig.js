/*
get_multisig: send transaction to third party for signature
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===init======================================================|

//-o_o===build=====================================================|
let send = (serialized_tx) => {
  try{
    return new Promise((resolve,reject)=>{
    
        
    
    });
  }
  catch(e){
    console.log("Errored sending serialized tx for multisig",e);
    reject(e);
  }
};
//-o_o===exports===================================================|
module.exports={send};
//-o_o===fin=======================================================|
