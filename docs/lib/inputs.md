# inputs.js

**Overview**

inputs.js is used to calculate inputs for a transaction. It makes a call to the node_interface to listunspent to get the unspent transaction outputs (utxo) of a given address. utxos represents how much spendable balance a given address contains. 

*An important note is that the listunspent method on the local node only works for local addresses. Non local addresses must be added using the importaddress method which has the /import_address endpoint at the node-interface. 

Once the interface returns the utxo set for the given address, it must be formatted for digibyte-lib as follows:
{
  "txId":utxos[i].txid,
  "outputIndex":utxos[i].vout,
  "address":utxos[i].address,
  "script":utxos[i].scriptPubKey,
  "satoshis":parseInt(utxos[i].amount * 100000000)
}

**Usage**

const utxo = require('./inputs');
...
utxo.build(address)
.then((inputs)=>{
  console.log(`Formatted utxo set for ${address}:\n${inputs});
})...