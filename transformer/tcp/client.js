'use strict';

module.exports = function client() {
    
    var net = require("net");
    var util = require("util");
    var events = require('events');

    var primus = this;
    var socket, distiller;

    var Distiller;
    try { Distiller = require("qprimus/transformer/tcp/distiller"); }
    catch(e){
        try { Distiller = require(__dirname + "/transformer/tcp/distiller"); }
        catch(e) { throw new Error('Unable To Load Distiller'); }
    }

    var factory = function(){
        var socket = new net.Socket();
        socket.setNoDelay(true);
        socket.setKeepAlive(true);
        var encoding = 'ascii';
        socket.setEncoding(encoding);
        var distiller = new Distiller();
        return { socket: socket, distiller: distiller };
    };

    //Connect to the given URL.
    primus.on('outgoing::open', function opening() {
        
        if (socket) { socket.end(); }
        if (distiller) { distiller.end(); }

        var components = factory();
        socket = components.socket;
        distiller = components.distiller;
        var url = primus.url;

        socket.connect(url.port, url.hostname);

        // Setup the Event handlers.
        socket.on("connect",    primus.emits('open'));
        socket.on('error',      primus.emits('error'));
        socket.on("end",        primus.emits('end'));
        
        socket.on("data",           function(data){ distiller.push(data); }); 
        distiller.on("message",     primus.emits('data'));
    });

    //Close The Socket Gracefully
    primus.on('outgoing::end', function close() {
        if (socket) {
            socket.end();
            distiller.end();
            socket = null;
            distiller = null;
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