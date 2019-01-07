'use strict'

const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const AnswerSchema=new Schema({
    description:{type:String,required:true},
    createdAt:{type:Date,required:true, default:Date.now},
    question:{type:Schema.Types.ObjectId,ref:'Question'},
    user:{type:Schema.Types.ObjectId, ref:'User'}
})

module.exports=mongoose.model('Answer',AnswerSchema);