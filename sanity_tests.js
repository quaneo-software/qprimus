var primus = require('primus');
var http = require('http');
  
var tcp = require('./transformer/tcp');
var pipeParser = require('./parser/pipe');

var Socket = primus.createSocket({ transformer: tcp, parser: pipeParser});

var url = "http://127.0.0.1:21100";

var client = new Socket(url, {
    reconnect: {
        maxDelay:   2000,       // Number: The max delay for a reconnect retry.
        minDelay:   500,        // Number: The minimum delay before we reconnect.
        retries:    5           // Number: How many times should we attempt to reconnect.
    }
});

client.on("open", function(){
    console.log('client is open');
});

client.on("end", function(){
    console.log('client end');
});

client.on("reconnect", function(){
    console.log('client reconnect');
});

client.on("error", function(){
    console.log('client error');
});

client.on("data", function(data){
    console.log('client data');
    console.log(data);
});
