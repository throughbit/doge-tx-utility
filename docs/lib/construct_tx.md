# construct_tx.js

## Dependencies

* sign.js as *signer*
* inputs.js as *utxo*
* logs.js as *logs*
* handle_errors.js as *errors*
* fees.js as *fees*
* request_options.js as *req_options*
* interface_request.js as *node_request*

## Overview

construct_tx.js defines two functions:


*build(outputs,isMultiSig):*

The build function collects all required data to sign a transaction, signs it and outputs a signed transaction hex to be broadcasted to a node and get validated on the network.

A bitcoin transactions requires the following data for signature:

1. Transaction inputs: provided by *utxo*

2. Transaction outputs: provided as the first argument to build()

3. Fees: provided by *fees*

4. Change Address: environment variable -> process.env.MSADDR

5. Private Key: environment variable -> process.env.MSPK1

build() also allows the facility for a multiSig transaction by passing 1 as the second argument.


*broadcast(hex):*

Broadcasts a raw transaction hex to the node interface via *node_request* and returns a txid upon success.

## Usage
(listener.js)

        const tx_util = require('./lib/construct_tx')
        //outputs must be an array of objects in the following format.
        const outputs = [
            {
              "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
              "amount":5000,
              "orderId":"TBDGB-9J298IJQ12312221"
            },
            {
              "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
              "amount":5000,
              "orderId":"TBDGB-95T698IJQ12376222"
            },
            {
              "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
              "amount":5000,
              "orderId":"TBDGB-9KL98IJQ123621113"
            }
        ];
        ...
        tx_util.build(outputs,1)
        .then((hex)=>{
          tx_util.broadcast(hex)
          .then((txid)=>{
            res.send(`Your transaction has been broadcasted successfully with txid: ${txid});
          })
        })
