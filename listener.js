/*
HYFERx Project
Tx Request Listener
Listens for a client request to broadcast and sign transactions to a given output set
output set is hard coded for testing purposes
*/
//-o_O===<..>===================================================~|
'use strict';
//-o_O===modules================================================~|

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const transactionSchema = require('./models/transaction');
const tx_util = require('./lib/construct_tx')
const errors = require('./lib/handle_errors');
const async_looper = require('./lib/async_loop');
const res_fmt = require('./lib/response_format');
//-o_o===init======================================================|
mongoose.connect("mongodb://localhost:27017/transactions",{"useNewUrlParser": true}, (error)=>{
  if(error){
  console.log("MongoDb is not connected.");
  }
  else{
    console.log("Successfully connected to MongoDb");
  }
});
const ObjectId=mongoose.Types.ObjectId;

var app = express();
const L_PORT=2020;
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
//Outputs will have to be provided by listening to a client
//Hardcoded for testing
//-o_o===server-===================================================|
app.post('/test_send',(req,res)=>{
  try{
     //-------------------------------------------LOGIC------------------------------------------------------
    // filter_request(req.body.send_orders)
    // .then((tx_outputs)=>{
    //   process_and_update(tx_outputs)
    // })
    // .catch((e)=>{
    //   errors.handle(e);
    // })
    //-------------------------------------------LOGIC------------------------------------------------------
    let send_orders = [
    {
      "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
      "amount":5000,
      "orderId":"TBDGB-9J298IJQ1238"
    },
    {
      "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
      "amount":5000,
      "orderId":"TBDGB-95T698IJQ123769"
    },
    {
      "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
      "amount":5000,
      "orderId":"TBDGB-9KL98IJQ12362"
    }
    ];
    
    let filtered_orders=new Array();//includes orderId
    let output_set=new Array();//output_set passed for signing
    let report_txid=new Array();//completed orders with txid for reporting back to client
//-o_o===filter-request--==========================================|
    async_looper.go(send_orders,(order,report)=>{ //order is the iterator 'send_orders[i]' in the for loop defined in async_loop
      transactionSchema.findOne({orderId:order.orderId})//search db for order with this orderId
      .exec((err,data)=>{
        
        let output = {
          "address": "",
          "amount": 0
        };
//if order is not in db, add it and push it into output_set for sign and broadcast
        if(data===null){
          console.log(`Okay, zis Order:${order.orderId} is not exist. Don't a worry. I will a send for process!`);
        
          let _tx = new transactionSchema({
            orderId : order.orderId,//can be added in the previous mongo call. 
            to: order.address,
            amount:order.amount
          });

          _tx.save((e)=> { 
            if(e!=null){
              console.log("Error writing to dB.");
              res.send(errors.handle(e));
            }
            else{
              console.log(`Added Order:${order.orderId} to dB.`);
            }
          });
        
          filtered_orders.push(order);

          output.address=order.address;
          output.amount=order.amount;
          output_set.push(output);
          
          report();
        }
//if order is in db check if it has a txid or not
        else if(data!=null){
        // console.log("Found entry with matching orderId",data);
// if it has a txid, push it into report_txid to notify client
          if (data.txId){
            console.log(`Order: ${data.orderId} has already been processed.\ntxId: ${data.txId}`);
            report_txid.push({
              "orderId": data.orderId,
              "txId": data.txId});
            report();
          }
// if it doesnt have a txid, push it into output_set to sign and broadcast
          else{
            console.log(`No txId for ${data.orderId}.  Added for processzing. \n`);
            
            filtered_orders.push(order);

            output.address=order.address;
            output.amount=order.amount;
            output_set.push(output);
          
            report();
          }
        }

        else if(err!=null){
          console.log("Demn. V r getsing an error!", err);
          res.send(errors.handle(err));
          //we cannot report here since this is an run-time error
        }
      });
    },()=>{//this is called only once all send_orders are filtered are reported

      // console.log(filtered_orders);
      if(output_set.length===0){
        console.log("OutputSet is empty. All transactions have been processed.");
        if(report_txid.length>0){
          let response = res_fmt.create(true,report_txid);
          res.send(response);
        }
        else{//most likely an empty set created.
          let response = res_fmt.create(false,"No outputs. No txId's to report. Check your request.");
          res.send(response);
        }
      }
      if(output_set.length>0){
        process_and_update(output_set,filtered_orders)
        .then((response)=>{//signed,broadcasted and updated to db
          if(report_txid.length!=0){//if some transactions were already done, add it to the response set
           report_txid.forEach((element)=>{
             response.message.push(element);
           })  
          }
          console.log("FINAL RESPONSE:\n", response);
          res.send(response);
        })
        .catch((e)=>{
          console.log("Caught:\n", e);
          res.send(errors.handle(e));
        });
      }
    });// by the end of this iteration we will have a output set prepared containing transactions that have not already been processed. 
//-o_o===filter-request--==========================================|   
   
    // setTimeout(printit,5000,outputs);
    // console.log("Good chance that this will print before map is done.\n");
    // console.log(`send_request:\n${send_orders}`);
    // console.log(`outputs:\n${outputs}`);
    //Check transactionDB if orderID is already processed
  }
  catch(e){
    res.send(errors.handle(e));
  }
});

//-o_o===process-==================================================|

let process_and_update=(output_set,filtered_orders)=>{
  try{
  
    //consider: take a single input with orderId and create output_set locally
    return new Promise((resolve,reject)=>{
      let order_txid=new Array();
      tx_util.build(output_set)
      .then((tx_hex)=>{//is signed
        tx_util.broadcast(tx_hex.message.toString())
        .then((txid)=>{
          async_looper.go(filtered_orders,(order,report)=>{
            transactionSchema.findOne({orderId: order.orderId})
            .exec((err,data)=>{
              if(err!=null){
                //If no error was thrown when creating db entry at tx_util.build() whats up here? 
                //Control should not ever be reaching here in production!
                console.log("Error writing to dB. Uh-oh PANIC!!This transaction could be broadcasted twice! Notify client!")
              }

              let dataId = data._id;
              delete data._id;
      
              data.txId = txid.message;
              
              order_txid.push({
                "orderId":order.orderId,
                "txId":txid.message
              });

              transactionSchema.updateOne({ _id: {$eq:ObjectId(dataId)} }, data, (err,data)=>{
                if(err!=null){
                  //If no error was thrown when creating db entry at tx_util.build() whats up here? 
                  //Control should not ever be reaching here in production!
                  console.log("Error writing to dB. Uh-oh PANIC!! This transaction could be broadcasted twice! Notify orderbook that txid is issued and db is not updated.")
                }
                if (data!=null){
                  console.log("Successfully updated db");
                
                  report();
                }
              });
            });
          },()=>{
              let response = res_fmt.create(true, order_txid);
              console.log(`Success Response: toFinal->`, response);
              console.log("\nHERE!!!!!!!!!!!!\n");
              resolve(response);
          });     
        })
        .catch((e)=>{
          reject(e);
        });
      })
      .catch((e)=>{
        reject(e);
      });
    });
  }
  catch(e){
    reject(e);
  }  
}
//-o_o===server-===================================================|
app.listen(L_PORT,()=>
 console.log(`TxRequest Listener running on port ${L_PORT}`)
);
//-o_o===fin=======================================================|
