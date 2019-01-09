'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var model = require('../models/questions');
var questions = model.questions;

var getQuestion = exports.getQuestion = function getQuestion(req, res, next) {
    var question = questions.find(function (question) {
        return question._id === +req.params.id;
    });
    req.question = question;
    next();
};

var getError = exports.getError = function getError(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            message: 'Unauthorized User',
            error: 'Login failed'
        });
    }
};

var handleError = exports.handleError = function handleError(err, res) {
    res.send(500).json({
        message: 'An error ocurr: ' + err.message,
        error: 'Server Error'
    });
};