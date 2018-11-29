/*
Keys: generate public-private key pairs
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===init======================================================|
const res_fmt = require('./response_format');
const async_looper = require('./async_loop');
const req_options = require('./request_options');

const digibyte = require('digibyte');
const request = require('request');

//-o_o===build=====================================================|
let generate = (amount,isMultiSig) => {
  try{
    return new Promise((resolve,reject)=>{

      let sets = new Array (parseInt(amount));
      let key_sets = new Array(); 

    
      let pubkey_set = "";

      async_looper.go(sets,(set,report)=>{    

        const pk = new digibyte.PrivateKey();
        const pubk = pk.toPublicKey();
        const addr = pubk.toAddress(digibyte.Networks.livenet);

        set = {
          private:pk,
          public:pubk,
          address:addr
        };
          //console.log(set);

        key_sets.push(set);
        pubkey_set=pubkey_set.concat(`${pubk},`);
        //comma separation is removed at the interface
        //last trailing comma removed in callback below

        report();
        },()=>{
          //console.log(key_sets);
          //console.log(pubkey_set);
        //console.log(isMultiSig);
          if (isMultiSig){

            pubkey_set = pubkey_set.slice(0,-1);
            let params = {
              n: amount,
              pubkeys: pubkey_set
            }

           //console.log(pubkey_set);
            req_options.build("interface",params,"/create_multisig","POST")
            .then((options)=>{
              request(options,(error,response,body)=>{
                if(error){
                  console.log("Rejecting: Error in createmultisig request to node itnerface.", error);
                  reject(error);
                }

                if(body.status){
                  let multisig_form = {
                    keys: key_sets,
                    multisig_data: body.message
                  }
                  let response = res_fmt.create(true,multisig_form);
                  
                  //console.log(body.message);
                  resolve(response);
                }
                else if(!body.status){
                  console.log("Error in createmultisig request to node interface.");
                  reject(body.message);
                }
              });
            })
            .catch((e)=>{
              console.log("Error building options for multisig request.");
              reject(e);
            });
          }

          else{
            let noms_response = res_fmt.create(true,key_sets);
            resolve(noms_response);
          }  
          
        }); //end of async looper
        
    });
  }
  catch(e){
    console.log("Errored generating key pair",e);
    reject(e);
  }
};
//-o_o===exports===================================================|
module.exports={generate};
//-o_o===fin=======================================================|
