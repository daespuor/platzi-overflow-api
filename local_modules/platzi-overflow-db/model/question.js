'use strict'

const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const QuestionSchema= new Schema({
    title: {type:String, required:true},
    description: {type:String, required:true},
    createdAt:{type:Date, required:true, default:Date.now},
    icon:{type:String,required:true},
    answers: [{type:Schema.Types.ObjectId,ref:'Answer'}],
    user:{type:Schema.Types.ObjectId,ref:'User'}
})

module.exports=mongoose.model('Question',QuestionSchema);