# listener.js

## Dependencies**

* **transaction.js** as *transactionSchema*
* **construct_tx.js** as *tx_util*
* **handle_errors.js** as *errors*
* **async_loop.js** as *async_looper*
* **response_format.js** as *res_fmt*

## Overview

listener.js is the starting point for requests to sign and broadcast transactions. Requests made to this server at endpoint "http://localhost:${process.env.L_PORT}/send" must include in its body a transaction output set, and whether it must be sent as a multiSig or not.

MongodB is used as an intermediary check point before any transactions are processed.

First the db is checked to find if transactions of the given orderId exists, if it does, the check goes further to see if a txid exists for this transaction. If it does, this transaction is added to report_txid. if not it is added to and output_set and filtered_orders.



filtered_orders = output_set + orderId field; and is used when updating db with orderId's after transactions are broadcasted with a txid.

          filtered_orders.push(order);

output_set is formatted according to how digibyte-lib takes transaction outputs into the sign function i.e.

          let output = {
            "address": "",
            "amount": 0
          };
          ...
          output.address=order.address;
          output.amount=order.amount;
          output_set.push(output);

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
Following the m          //outputs must be an array of objects in the following format.
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
          ];ongoose filter, if output_set contains values, process_and_upd          //outputs must be an array of objects in the following format.
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
          ];ate() is called.
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
process_and_upd          //outputs must be an array of objects in the following format.
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
          ];ate() calls build() followed by broadcast() from 2*.
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
Format returned          //outputs must be an array of objects in the following format.
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
          ]; to client:

          order_txid = [{
            "orderId":32094823094,
            "txid": <sometxid>
          }...]


Upon successful resolution from broadcast() the db is updated and control resolves an order_txid array back to the server endpoint to send out a response set to the client. Prior to sending, a check is done to see if the report_txid contains some completed transactions to add to the response to the client.
