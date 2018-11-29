#!/usr/bin/env node
/*
Digibyte CommandLine Client

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
const signer = require('./lib/sign.js');
const broadcast = require('./lib/construct_tx.js');
const utxo = require('./lib/inputs.js');
const key_set = require('./lib/keys.js');

let program = require('commander');
//-o_o===init====================================================|
program
 .version('0.1.0')
 .description('digibyte tx sign & broadcast.\n be careful!!\n this program is unsafe as it does not check inputs.');
//-o_O===<o..o>=================================================~|
 program
 .command('sign <utxo_address> <to_address> <to_amount> <fee> <change> <privatekey>')
 .alias('s')
 .description('digibyte transaction signer.')
 .action((utxo_address,to_address,to_amount,fee,change,privatekey)=>{
  utxo.build_tx_inputs(String(utxo_address))
  .then((inputs)=>{
   let output = {"address":to_address,"amount":parseInt(to_amount)};
   let outputs = [];
   outputs.push(output);
   signer.sign_tx(inputs.message_array,outputs,parseInt(fee),change,privatekey)
   .then((hex)=>{
    console.log("\n\n\n\nHex ready for broadcast:\n",hex.message);
    console.log("\n!!!DETAILS!!!\n");
    console.log(`From:${utxo_address}\nTo:${to_address}\nAmount:${to_amount}\nFee:${fee}\nChange:${change}\n\n`);
   })
   .catch((e)=>{
    console.log("Error in signing transaction.\n",e);
   })
  })
  .catch((e)=>{
   console.log("Error in building utxo.\n",e);
  });
 });
//-o_O===<o..o>=================================================~|
program
 .command('broadcast <hex>')
 .alias('b')
 .description('broadcast digibyte transaction')
 .action((hex)=>{
  broadcast.broadcast_to_node(hex)
  .then((txid)=>{
   console.log("\n\n\n\nTransaction broadcasted successfully.\n\nTxId:",txid.message);
   console.log("\n\n");
  })
  .catch((e)=>{
   console.log("Error in broadcasting.\n",e);
  });
 });
//-o_O===<o..o>=================================================~|
 program
 .command('keygen <amount> <isMultiSig>')
 .alias('k')
 .description('generate key-pairs and address set. Option to create multisig address.')
 .action((amount,isMultiSig)=>{
   isMultiSig=parseInt(isMultiSig); //0 = false , 1 = true
  key_set.generate(amount,isMultiSig)
  .then((set)=>{
  // console.log(set);
   console.log("\n\n\n\nKey set generated.\n\nSet:",set.message);
   console.log("\n\n");
  })
  .catch((e)=>{
   console.log("Error in generating key set.\n",e);
  });
 });
//-o_O===<o..o>=================================================~|

program
 .parse(process.argv);
//-o_o===fin=====================================================|
