"use strict";
var events = require('events');
var _ = require("underscore");


var distiller = function(delimiter){
    this.delimiter = "\0";
    this.buffer = '';
};

_.extend(distiller.prototype, events.EventEmitter.prototype, {
    push: function(data){
        if (data instanceof Buffer) { data = data.toString(); }
        var messages = data.split(this.delimiter);
        messages[0] = this.buffer + messages[0];
        this.buffer = messages.pop();
        var self = this;
        messages.forEach(function(message) {
            self.emit('message', message);
        });
    },
    end: function(){
        var self = this;
        if (this.buffer.length > 0) {
            self.emit('message', this.buffer);
            this.buffer = '';
        }
        self.emit('end');
    }
});

module.exports = distiller;
