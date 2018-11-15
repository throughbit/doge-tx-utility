# DGBTxUtility

**Test Version**

Digibyte utitlity for signing and broadcasting transactions to an external node. 

### Test Control Flow:

**curl -X POST "http://localhost:$L_PORT/test_send"**

## **listener.js** 

listens for requests from a  client to create a transaction. 

In this test case - the client is the system making the above curl request. 

For production, the request will require passing **transaction outputs** i.e. (to_address:amount) which is parsed by **build-tx-outputs.js**. This is currently hard coded as a variable "__outputs__" for testing therefore build-tx-outputs.js is not being used currently.
When recieving the test_send curl request, the hard-coded outputs are passed to broadcast_tx(outputs) from build-tx-complete.js.
Release version will read outputs from request body.

Currently uses mongodb as the first step in control flow. 

Only orderId's that either do not exist or do not have a txid, will be processed. 

### **/lib/construct_tx.js** 

provides DGB Key services. contains two functions:
    
- **__build(ouputs)__**: 
       
builds and signs transactions.
   
calls build_tx_inputs(addresses) from **inputs.js** to generate **transaction inputs**. 
        
-   *addresses here are the available utxo address for the given key* .
   
build_tx_tnputs() makes a request to our remote node interface calling endpoint /get_utxo. 
                    
the result is then parsed into the format required by digibyte-lib as **inputs**
        
once fetched and formatted __inputs__ are resolved .then(sign_tx.()) is called.

        
- __**sign_tx(inputs, outputs, fee, change, pk)**__: /lib/sign.js
   
signs transactions using inputs and outputs fetched via requests. Fee change and pk are hardcoded global/env variables. 
    
*No requests are made within sign_tx() in order to isolate the module that performs operations using the pk from modules.

This removes concerns about dodgy async behaviour affecting any critical pk related operations. 

More checks required within sign_tx() to ensure inputs and outputs are correctly formatted and verified before signing.* 
        
-> After sign_tx() resolves a __tx_hex__, control flows back to broadcast_tx which .then() passes the hex to broadcast().


- **__broadcast(hex)__**:
         
connects to a remote node and provides a raw tx-hex to the sendrawtransaction function. 


upon receipt of a __txid__ broadcast() will resolve back to the listener.js which will then respond back to the client with a __txid__ of the *successful* transaction.

### /lib/response_format.js

Defines a format for passing responses. All responses follow the format: 

**{status:boolean, message:{}}**

Responses are created by calling:

- create(true,"message");

- create(false,"message");

eg. **{status: true, message: "Successfully saved"}**

### /lib/handle_errors.js

Defines all possible errors and creates error objects that display the entire stack trace to allow ease of debugging. 

### /lib/logs.js

logs defines a format for logging to a file.

currently only a format for the sign_tx() function exists, which logs a history of all signed transactions for both success and fails cases.

**requires an extension for broadcast**

### /lib/async_loop.js

provides a go() function, which allows predictable async looping.

### Notes:

- Transactions must only be made with a time interval of 6 blocks since UTxO's are hard-coded to only be spendable after 6 confirmations. This equates to ~1.5 minutes. This can be changed by adjusting the minconf value in the express endpoint for listunspent in the NodeServer.js from BTCServices.

- wait.js is not being used. BUT WAIT! 

### UPGRADES:

- Accept tx_ouputs from client.

- Check if inputs and outputs are in the correct format at sign_tx()

- **Efficient error handling using errors.js**

### Security Notes:

All sensitive variables are stored as environment variables. 

Further obfuscate based on your levels of paranoia.

**If you have any recommendations on best practices for storing authentication tokens on a server, please leave a message :)**

## Support/Bug Reporting: zenchan@protonmail.com
