'use strict'

const mongoose = require('mongoose');
const Question = require('./model/question');
const User = require('./model/user');
const Answer= require('./model/answer');
const debug = require('debug')('platzi-overflow:db');
const setupDb= require('./db');


function setup(){
    setupDb();
    const questionService= require('./lib/question')(Question);
    const userService= require('./lib/user')(User);
    const answerService= require('./lib/answer')(Answer);
    return {
        questionService,
        userService,
        answerService
    }
}


module.exports=setup

