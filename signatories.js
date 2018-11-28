/*
Signatories: server maintained by all multisig signatories

Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===init======================================================|
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const digibyte = require('digibyte');

const res_fmt = require('./lib/response_format');
//-o_o===setup=====================================================|
const app = express();
const PORT=process.env.MSPORT;
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
//-o_o===endpoiunt=====================================================|
app.get("/", (req,res)=>{
  console.log(`Received transaction to sign: ${req.body})}`);

  let multiSigTx = new digibyte.Transaction(req.body).sign(process.env.MSPK2);

 // assert(multiSigTx.isFullySigned());
  console.log(`SignedTx at Signatory: ${JSON.stringify(multiSigTx.isFullySigned())}`);
  let response = res_fmt.create(true,multiSigTx.toObject());
  res.send(response);
})
//-o_o===exports===================================================|
app.listen(PORT,()=>
 console.log(`Signatory server live at ${PORT}`)
);
//-o_o===fin=======================================================|
