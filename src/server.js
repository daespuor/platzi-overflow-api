'use strict'

const http = require('http');
const Debug = require('debug');
const express = require('express');
const bodyParser = require('body-parser');
const asyncify= require('express-asyncify');
const {PORT}= require('./config/properties');
const api = require('./api');
const app= asyncify(express());
const debug= new Debug('platzi-overflow:server');
const path= require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

if(process.env.NODE_ENV==='development'){
    app.use((req,res,next)=>{
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Headers','Origin, X-Request-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
        console.log('Access Control Allow');
        next();
    });
}

if(process.env.NODE_ENV==='production'){
    app.use((req,res,next)=>{
        res.setHeader('Access-Control-Allow-Origin','platzioverflowangular.herokuapp.com');
        res.setHeader('Access-Control-Allow-Headers','Origin, X-Request-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
        console.log('Access Control Allow');
        next();
    });
}

app.use('/api',api);

const server= http.createServer(app);

if(!module.parent){
    server.listen(PORT,()=>{
        debug(`Servidor activo en el puerto ${PORT}`);
    });
}
module.exports=server;