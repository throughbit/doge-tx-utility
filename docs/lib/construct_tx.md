# construct_tx.js

1*./sign.js
2*./inputs.js
3*./logs.js
4*./response_format.js
5*./handle_errors.js
6*./fees.js
7*./request_options.js
8*./interface_request.js

**Overview**

construct_tx.js defines two functions: build() & broadcast().

*build(outputs,isMultiSig):*

The build function collects all required data to sign a transaction, signs it and outputs a signed transaction hex to be broadcasted to a node and get validated on the network. 

A bitcoin transactions requires the following data for signature:
1. Transaction inputs: provided by 2*
2. Transaction outputs: provided as an argument when build() is called
3. Fees: provided by 6*
4. Change Address: environment variable -> process.env.MSADDR
5. Private Key: environment variable -> process.env.MSPK1

build() also allows the facility for a multi-sig transaction by passing 1 as the second argument.


*broadcast(hex):*

Broadcasts a raw transaction hex to the node interface via 7* and returns a txid upon success.


**Usage**

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

as seen in listener.js line 175++
