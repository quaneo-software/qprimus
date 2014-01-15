'use strict';

module.exports = {
    
    encoder: function encoder(data, fn) {
        var xmlmapper = require('xml-mapping');
        var err;
        try { data = xmlmapper.toxml(data); }
        catch (e) { console.log(e); err = e; }
        console.log('encode-xml');
        console.log(data);
        return fn(null, data);
    },

    decoder: function decoder(data, fn) {
        var xmlmapper = require('xml-mapping');
        var err;
        try { data = xmlmapper.tojson(data); }
        catch (e) { err = e; }
        console.log('decode-xml');
        console.log(data);
        return fn(null, data);
    }

};