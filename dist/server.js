'use strict';

var http = require('http');
var Debug = require('debug');
var express = require('express');
var bodyParser = require('body-parser');
var asyncify = require('express-asyncify');

var _require = require('./config/properties'),
    PORT = _require.PORT;

var api = require('./api');
var app = asyncify(express());
var debug = new Debug('platzi-overflow:server');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
        console.log('Access Control Allow');
        next();
    });
}

/*if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(process.cwd(),'dist')));
    console.log('using babel');
}*/

app.use('/api', api);

var server = http.createServer(app);

if (!module.parent) {
    server.listen(PORT, function () {
        debug('Servidor activo en el puerto ' + PORT);
    });
}
module.exports = server;