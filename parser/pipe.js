'use strict';

module.exports = {
    
    encoder: function encoder(data, fn) {
        return fn(null, data);
    },

    decoder: function decoder(data, fn) {
        return fn(null, data);
    }

};
