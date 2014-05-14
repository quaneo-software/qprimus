Primus-Tcp
=======

Primus Raw TCP Transformer.
Connect Node.js to Vanilla TCP Servers via Primus.

## Getting Started
Install the transformer with this command:

```shell
npm install primus-tcp --save
```

Add the transformer to the Primus constructor and subscribe to the events.

```javascript
var primus = require('primus');
var transformer = require('primus-tcp/transformer/tcp');
var parser = require('primus-tcp/parser/pipe');

var PrimusSocket = primus.createSocket({
    transformer: transformer,
    parser: parser
});

var url = "...";    //Destination Server
var options = { };  //Standard Primus Options

var connection = new PrimusSocket(url, options);

//Standard Primus Events
connection.on("open", function(){ /*...*/ });
connection.on("end", function(){ /*...*/ });
connection.on("reconnect", function(){ /*...*/ });
connection.on("error", function(){ /*...*/ });
connection.on("data", function(data){ /*...*/ });
```

Now we are able to connect to a vanilla tcp server (Java?) and still keep all the really nice abstractions (reconnect, heartbeat, etc) that make Primus great.

