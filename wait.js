/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Digibyte Transaction Builder
Builds a raw transaction and signs offline.
Broadcasts to a remote node - preferably over a local network to isolate keys from the internet
*/
//-o_O===init===================================================~|
'use strict';
//-o_o===f(x)====================================================|
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
//-o_o===exports=================================================|
module.exports = {wait}
//-o_o===fin=====================================================|
