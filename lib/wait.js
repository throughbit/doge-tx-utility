/*
Wait

Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project

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
