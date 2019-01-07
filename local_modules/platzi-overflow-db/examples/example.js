'use strict'
const setup= require('../index');

async function start(){
    const db=setup();
    let questions=await db.questionService.findAll();
    console.log(questions);
}

process.on('uncaughtException',console.log);
process.on('unhandledRejection',console.log);

start();





