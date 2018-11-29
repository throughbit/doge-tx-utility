/*
Transaction Model
Stores all completed transactions by OrderID

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project

*/
//-o_O===init===================================================~|
'use strict';
//-o_o===modules=================================================|
const mongoose = require('mongoose');
//-o_o===schema==================================================|
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  orderId : {type: String},
  to: {type: String},
  amount:{type: Number},
  txId: {type: String}
});
//-o_o===exports=================================================|
module.exports = mongoose.model('transaction', transactionSchema);
//-o_o===fin=====================================================|
