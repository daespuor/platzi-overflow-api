'use strict';

var express = require('express');
var asyncify = require('express-asyncify');
var Debug = require('debug');
var debug = new Debug('platzi-overflow:auth');
var db = require('platzi-overflow-db');
var properties = require('./config/properties');
var config = require('./config/auth');

var _require = require('./middlewares/index'),
    getError = _require.getError,
    handleError = _require.handleError;

var utils = require('./utils/utils');
var auth = require('express-jwt');
var api = asyncify(express.Router());
var dbSetup = null;

api.use(function (req, res, next) {
    dbSetup = db();
    next();
});

api.get('/questions', async function (req, res) {
    try {
        var sort = req.query.sort;

        var questions = await dbSetup.questionService.findAll(sort);
        res.status(200).json(questions);
    } catch (err) {
        handleError(err);
    }
});

api.get('/questions/:id', async function (req, res) {
    try {
        var question = await dbSetup.questionService.findById(req.params.id);
        res.status(200).json(question);
    } catch (err) {
        handleError(err);
    }
});

api.post('/questions', auth({ secret: properties.secret }), async function (req, res) {
    var _req$body = req.body,
        icon = _req$body.icon,
        description = _req$body.description,
        title = _req$body.title;

    try {
        var newQuestion = {
            title: title,
            description: description,
            icon: icon,
            user: req.user.user._id,
            answers: []
        };
        var question = await dbSetup.questionService.createQuestion(newQuestion);
        res.status(201).json(question);
    } catch (err) {
        handleError(err);
    }
});

api.post('/questions/:id/answers', auth({ secret: properties.secret }), async function (req, res) {
    try {
        var currQuestion = await dbSetup.questionService.findById(req.params.id);
        var description = req.body.description;

        var answer = {
            description: description,
            question: currQuestion._id,
            user: req.user.user._id
        };

        var newAnswer = await dbSetup.answerService.createAnswer(answer);
        currQuestion.answers.push(newAnswer);
        await currQuestion.save();
        res.status(201).json(newAnswer);
    } catch (err) {
        handleError(err);
    }
});

api.post('/auth/signin', async function (req, res, next) {
    var _req$body2 = req.body,
        email = _req$body2.email,
        password = _req$body2.password;

    try {
        var user = await dbSetup.userService.findByEmail(email);

        if (!user) {
            debug('Email or password are invalid: Email:' + email + ', Password:' + password);
            return utils.handleLoginFail(res);
        }

        if (!utils.comparePasswords(password, user.password)) {
            debug('Password invalid: password ' + password);
            return utils.handleLoginFail(res);
        }
        var token = config.getToken(user);
        res.status(200).json({
            message: 'Login success',
            token: token,
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (err) {
        handleError(err);
    }
});

api.post('/auth/signup', async function (req, res, next) {
    try {
        var newUser = await dbSetup.userService.createUser(req.body);
        var token = config.getToken(newUser);
        res.status(201).json({
            message: 'User created',
            token: token,
            userId: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        });
    } catch (err) {
        handleError(err);
    }
});

api.use(getError);

module.exports = api;