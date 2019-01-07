'use strict'
const debug= require('debug')('platzi-overflow:db')

module.exports=(Answer)=> {
    
    async function createAnswer(answer){
        debug('Creating an answer');
        const newAnswer= new Answer(answer);
        return await newAnswer.save();

    }
   
    return {
        createAnswer
    }
}