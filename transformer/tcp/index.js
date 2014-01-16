'use strict';

var Transformer = require('primus').Transformer;

var PrimalTransformer = Transformer.extend({
    server: require('./server'),
    client: require('./client')
});

module.exports = PrimalTransformer;