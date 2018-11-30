# fees.js

## Dependencies

* options.js as *options*
* node_request.js as *node_interface*

## Overview

fees.js is a dynamic fee calculator.

It makes a request via *node_interface* for node-cli method getnetworkinfo and uses (info.relayfee + 247) in satoshis as the fee.

## Usage
(construct_tx.js)

        const fees = require('fees.js');
        ...
        fees.get()
        .then((fee)=>{
          console.log(`Miner fee for current block: ${fee}`);
        })
