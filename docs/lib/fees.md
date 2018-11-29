# fees.js

**Overview**

fees.js is a dynamic fee calculator.

It makes a request to the node-interface for getnetworkinfo and uses (info.relayfee + 247) in satoshis as the fee.

**Usage**

const fees = require('fees.js');

fees.get()
.then((fee)=>{
  console.log(`Miner fee for current block: ${fee}`);
})