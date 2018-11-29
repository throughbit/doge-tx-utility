/*
Slack Node

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
*/
//-o_O==========================================================~|
'use strict';
//-o_o===modules=================================================|
const res_fmt = require('./response_format.js');

const Slack = require ('slack-node');

//-o_O===init===================================================~|
const webhookUri = process.env.Slack_Weburi;
//-o_O===SlackNode==============================================~|
let update = (data,title)=>{
 let slack = new Slack();
 slack.setWebhook(webhookUri);
 slack.webhook({
  channel: "#node-updates",
  username: title,
  icon_emoji: ":ghost:",
  text: data
  }, function(err, response) {
  if (response){
   let message=res_fmt.create(true,`Slack response: ${response}`);
   console.log("Slacker says: ", message);
   return message;
  }
  if (err){
   let message=res_fmt.create(false,`Slack error: ${err}`);
   console.log("Slacker says: ", message);
   return message;
  }
 });
}
//-o_o===exports=====================================================|
module.exports={update};
//-o_o===fin=====================================================|
