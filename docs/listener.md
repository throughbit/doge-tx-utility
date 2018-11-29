# listener.js

**Dependencies**

1*./models/transaction
2*./lib/construct_tx
3*./lib/handle_errors
4*./lib/async_loop
5*./lib/response_format

**Overview**

listener.js is the starting point for requests to sign and broadcast transactions. Requests made to this server at endpoint "http://localhost:${process.env.L_PORT}/send" must include in its body a transaction output set, and whether it must be sent as a multiSig or not. 

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

MongodB is used as an intermediary check point before any transactions are processed. 

First the db is checked to find if transactions of the given orderId exists, if it does, the check goes further to see if a txid exists for this transaction. If it does, this transaction is added to report_txid. if not it is added to and output_set and filtered_orders. 

filtered_orders = output_set + orderId field; and is used when updating db with orderId's after transactions are broadcasted with a txid.

output_set is formatted according to how digibyte-lib takes transaction outputs into the sign function i.e. 
{
  address:address,
  amount:amount
} 
It is passed to build(output,isMultiSig) from 2* here. 

Following the mongoose filter, if output_set contains values, process_and_update() is called. 

process_and_update() calls build() followed by broadcast() from 2*.

Format returned to client:
order_txid = [{
  "orderId":32094823094,
  "txid": <sometxid>
}...]


Upon successful resolution from broadcast() the db is updated and control resolves an order_txid array back to the server endpoint to send out a response set to the client. Prior to sending, a check is done to see if the report_txid contains some completed transactions to add to the response to the client. 

