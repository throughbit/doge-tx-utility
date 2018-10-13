/*Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
Transaction broadcaster
Broadcasts a raw tx hex to a remote node
*/
//-==<._o>======================================================~|
'use strict';
//-o_o===modules=================================================|
const request = require('request');
const bodyParser = require('body-parser');
//-o_O===init===================================================~|
//Node interface port
const NI_PORT = process.env.NI_PORT;
const RPC_AUTH = process.env.RPC_AUTH;
const digiurl = `http://localhost:${NI_PORT}/broadcastx`;

//-o_o===REQUEST=================================================|
function broadcast_to_node (hex){
 return new Promise ((resolve,reject) => {
  try{
   //console.log("HEX:", hex);
   let options = {
      headers:{ "content-type": "application/JSON" },
      url: digiurl,
      method: 'POST',
      body:{"hex":hex},
      json: true
   }
   request(options,(error, response, body)=>{
    if(error){
     console.log("Rejecting: Error from request made from broadcast_to_node. \n", error);
     reject (error);
    }
    console.log("Resolving: Got  body from request made from broadcast_to_node. \n",body);
    resolve (body.result);
   });
  }
  catch(e){
   console.log("Rejecting: Error from broadcast_to_node(hex)\n",e);
   reject(e);
  }
 });
}
//-o_0===export==================================================|
module.exports={broadcast_to_node};
//-o_0===fin=====================================================|
