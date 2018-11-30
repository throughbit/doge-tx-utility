# logs.js

## Overview

logs.js is used to log all transactions that have been signed by the utility.

Log format is defined by:

Success Format:

        const s_log={
          "time":time,
          "status": "success",
          "message": `Transactions have been signed.`,
          "transaction_outputs": data.outputs,
          "transaction_inputs": data.inputs,
          "hex":data.hex
        }

Failure Format:

        const f_log={
            "time":time,
            "status": "fail",
            "message":`Error signing transactions.`,
            "transaction_outputs": data.outputs,
            "transaction_inputs": data.inputs
        }

## Usage

        const logs = require('logs.js');

To log success:
        logs.write_sign(true,data);

To log failure:
        logs.write_sign(false,data);
