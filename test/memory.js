
var fs = require('fs');
var jsdom  = require('jsdom');
var util = require('util');
var jquery = fs.readFileSync("../lib/jquery.js", "utf-8");

var count = 0;
function doit() {
  console.log('allocating a window');
  jsdom.env('<html><body></body></html>', [jquery.js], function(errors, window) {
    if (errors) {
      console.error("Got errors : "+errors);
      return;
    }
    console.log('calling close');
    //window.close();
    if (++count < 500) {
      if (count % 100 == 0) {
        console.log(util.inspect(process.memoryUsage()));
      }   
      process.nextTick(doit);
    }   
  }); 
}

doit();
