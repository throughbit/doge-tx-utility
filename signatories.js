/*
signatories: server maintained by all multisig signatories

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
  console.log(`SignedTx at Signatory: ${JSON.stringify(multiSigTx)}`);
  res.status(200).send(multiSigTx);
})
//-o_o===exports===================================================|
app.listen(PORT,()=>
 console.log(`Signatory server live at ${PORT}`)
);
//-o_o===fin=======================================================|
