# send_request.js

**Overview**

send_request.js is a testing module for listener.js serving the endpoint `http://localhost:${process.env.L_PORT}/send`.

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

**Usage**

node send_request.js