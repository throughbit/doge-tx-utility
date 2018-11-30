# send_request.js

**Overview**

send_request.js is a testing module for listener.js serving the endpoint `http://localhost:${process.env.L_PORT}/send`.

          //outputs must be an array of objects in the following format.
          let send_orders = [
            {
              "address": "DDzvD6JoaHFTubzfPoKf7m8dfp9quKD1dJ",
              "amount":5000,
              "orderId":"TBDGB-9J29"
            },
            {
              "address": "DRjtBctsX1Yive8TyyTrGHK57eUV9UujHx",
              "amount":5000,
              "orderId":"TBDGB-95T6"
            },
            {
              "address": "DDQrE3xVgYjcgFdL8xsPWtutsYJxc7gLN4",
              "amount":5000,
              "orderId":"TBDGB-9KL9"
            }
            ];

**Usage**

          node send_request.js