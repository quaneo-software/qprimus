'use strict';

module.exports = function client() {
    
    var net = require("net");
    var util = require("util");
    var events = require('events');

    var primus = this;
    var socket, distil;

    var distiller = require(__dirname + "/transformer/tcp/distiller");
    // console.log('distiller: ' + distiller);

    var factory = function(){
        var socket = new net.Socket();
        socket.setNoDelay(true);
        socket.setKeepAlive(true);
        var encoding = 'ascii';
        socket.setEncoding(encoding);
        var distil = new distiller();
        return { socket: socket, distil: distil };
    };

    //Connect to the given URL.
    primus.on('outgoing::open', function opening() {
        
        if (socket) { socket.end(); }
        if (distil) { distil.end(); }

        var components = factory();
        socket = components.socket;
        distil = components.distil;
        var url = primus.url;

        console.log('socket: connecting to server: ' + url.hostname + ' port: ' + url.port);

        socket.connect(url.port, url.hostname);

        // Setup the Event handlers.
        socket.on("connect",    primus.emits('open'));
        socket.on('error',      primus.emits('error'));
        socket.on("end",        primus.emits('end'));
        
        socket.on("data",       function(data){
            console.log('----RAW DATA------');
            console.log(data);
            console.log('----END RAW DATA------')
            distil.push(data);
        }); 

        distil.on("message",    primus.emits('data'));
    });

    //Close The Socket Gracefully
    primus.on('outgoing::end', function close() {
        if (socket) {
            socket.end();
            distil.end();
            socket = null;
            distil = null;
        }
    });

    //Attempt to reconnect the socket. It assumes that the `close` event is
    //called if it failed to disconnect.
    primus.on('outgoing::reconnect', function() {
        primus.emit('outgoing::end');
        primus.emit('outgoing::open');
    });

    //Write A New Message To The Socket
    primus.on('outgoing::data', function(message) {
        var encoding = 'ascii';
        var message = message + '\r\n';
        if(socket) { socket.write(message, encoding); }
    });


};