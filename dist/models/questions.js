'use strict';

var question = {
    _id: 1,
    title: '¿Por que ese programa es tan malo?',
    description: 'Esta es una pregunta...',
    createdAt: new Date(),
    icon: 'devicon-android-plain',
    answers: [],
    user: {
        firstname: 'Daniel',
        lastname: 'Puerta',
        email: 'daespuor@hotmail.com',
        password: '123456'
    }
};
var newQuestion = {
    _id: +new Date(),
    createdAt: new Date(),
    answers: [],
    user: {
        firstname: 'Daniel',
        lastname: 'Puerta',
        email: 'daespuor@hotmail.com',
        password: '123456'
    }
};
var newAnswer = {
    createdAt: new Date(),
    user: {
        firstname: 'Daniel',
        lastname: 'Puerta',
        email: 'daespuor@hotmail.com',
        password: '123456'
    }
};
var questions = new Array(10).fill(question);

module.exports = {
    question: question,
    questions: questions,
    newQuestion: newQuestion,
    newAnswer: newAnswer
};