# inputs.js

## Dependencies

* options.js as *req_options*
* interface_request.js as *node_interface*

## Overview

inputs.js is used to calculate inputs for a transaction. It makes a call to the node_interface to listunspent to get the unspent transaction outputs (utxo) of a given address.

senders {address,utxo} form the input to a transaction & the receivers {address,amount} form the output.

**Note**    
listunspent method on the local node only works for local addresses. Non local addresses must be added using the importaddress method which is served at the /import_address endpoint at the node interface. If this utility is being used in a wallet application, every new client's addresses must be automatically imported upon creation.

Once the interface returns the utxo set for the given address, it is formatted for digibyte-lib as follows:
(lines 76-92)

        //RECURSION METHOD
        let uform = new Array();
        let format = (i)=>{
          if(i < utxos.length){//more utxos to format
            uform.push({
              "txId":utxos[i].txid,
              "outputIndex":utxos[i].vout,
              "address":utxos[i].address,
              "script":utxos[i].scriptPubKey,
              "satoshis":parseInt(utxos[i].amount * 100000000)
            });
            format(i+1);
          }
          if(i>=utxos.length){ //all utxos formatted
            resolve (uform);
          }
        }

## Usage

        const utxo = require('./inputs');
        ...
        utxo.build(address)
        .then((inputs)=>{
          console.log(`Formatted utxo set for ${address}:\n${inputs});
        })...
