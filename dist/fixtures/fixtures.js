'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var question = {
    _id: 1,
    title: '¿Por que ese programa es tan malo?',
    description: 'Esta es una pregunta...',
    createdAt: '10/10/2018',
    icon: 'devicon-android-plain',
    answers: [],
    user: {
        _id: 1,
        firstname: 'Daniel',
        lastname: 'Puerta',
        email: 'daespuor@hotmail.com',
        password: '123456'
    }
};
var questionWithAnswers = Object.assign({ answers: [newAnswer] }, question);
var newQuestion = {
    title: question.title,
    description: question.description,
    icon: question.icon,
    user: 1,
    answers: []
};
var questions = new Array(11).fill(question);
var newAnswer = {
    description: 'Esta es una respuesta',
    question: 1,
    user: 1
};

var user = {
    firstName: 'Daniel',
    lastName: 'Puerta',
    email: 'daespuor@hotmail.com',
    password: '123456',
    _id: 1
};

var newUser = {
    firstName: 'Daniel',
    lastName: 'Puerta',
    email: 'daespuor@hotmail.com',
    password: '123456'
};

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0TmFtZSI6IkRhbmllbCIsImxhc3ROYW1lIjoiUHVlcnRhIiwiZW1haWwiOiJkYWVzcHVvckBob3RtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiX2lkIjoxfSwiaWF0IjoxNTQ2OTk0OTMwfQ.3WVKpvX6jVNqwSTG-8dCLwsV-Ct2uZc9l6lEPhABtYg';
exports.default = {
    question: question,
    questionWithAnswers: questionWithAnswers,
    newQuestion: newQuestion,
    questions: questions,
    newAnswer: newAnswer,
    user: user,
    token: token,
    newUser: newUser
};