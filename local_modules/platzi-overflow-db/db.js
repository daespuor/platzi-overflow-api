'use strict'

const mongoose= require('mongoose');
const properties = require('./config/properties');
const debug= require('debug')('platzi-overflow:db');
let db=null;
const setupDb=()=>{
    if(db===null){
        mongoose.connect(properties.mongoUrl,{useNewUrlParser:true,useCreateIndex:true});
        db=mongoose.connection;
    }
    db.on('open',()=>{
        debug('The connection is open')
    });
    db.on('error',console.log);

}

module.exports=setupDb;