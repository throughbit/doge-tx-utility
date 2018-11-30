# doge_tx_utility

**Test Version**

Dogecoin utility for signing and broadcasting transactions to a full-node via a node interface.

### Test Control Flow:

        cd test
        node send_request.js

Change hardcoded orderId for each test run

### Notes:

- Transactions must only be made with a time interval of 6 blocks since UTxO's are hard-coded to only be spendable after 2 confirmations. This equates to ~30 seconds. This can be changed by adjusting the minconf value in the express endpoint for listunspent in the interface.js from btc-node-interface.

- importaddress for addresses used in sendwallet

- wait.js is not being used. BUT WAIT!

### UPGRADES:

- Accept tx_ouputs from client.

- Check if inputs and outputs are in the correct format at sign_tx()

- **Efficient error handling using errors.js**

### Security Notes:

All sensitive variables are stored as environment variables.

Further obfuscate based on your levels of paranoia.

**If you have any recommendations on best practices for storing authentication tokens on a server, please leave a message :)**

## Support/Bug Reporting: viz@throughbit.com
