'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema=mongoose.Schema;

const UserSchema= new Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true, unique:true, index:true},
    password:{type:String, required:true}
});

UserSchema.plugin(uniqueValidator);

module.exports= mongoose.model('User',UserSchema);