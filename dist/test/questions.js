'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _fixtures = require('../fixtures/fixtures');

var _fixtures2 = _interopRequireDefault(_fixtures);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var questionsFix = _fixtures2.default.questions;
var questionFix = _fixtures2.default.question;
var answerFix = _fixtures2.default.newAnswer;
var userFix = _fixtures2.default.user;
var token = _fixtures2.default.token;
var newUserFix = _fixtures2.default.newUser;
var newQuestionFix = _fixtures2.default.newQuestion;
var sandbox = null;
var errorAuth = {
    message: 'Unauthorized User',
    error: 'Login failed'
};
var questionServiceStub = null;
var userServiceStub = null;
var answerServiceStub = null;
var server = null;
var api = null;
var config = null;

_ava2.default.beforeEach(function (t) {
    sandbox = _sinon2.default.createSandbox();
    config = {
        getToken: sandbox.stub()
    };
    userServiceStub = {
        createUser: sandbox.stub(),
        findByEmail: sandbox.stub()
    };
    questionServiceStub = {
        findAll: sandbox.stub(),
        createQuestion: sandbox.stub(),
        findById: sandbox.stub(),
        updateQuestion: sandbox.stub()
    };
    answerServiceStub = {
        createAnswer: sandbox.stub()
    };

    config.getToken.withArgs(userFix).returns(token);
    config.getToken.withArgs(newUserFix).returns(token);
    userServiceStub.createUser.withArgs(newUserFix).returns(Promise.resolve(userFix));
    userServiceStub.findByEmail.withArgs(userFix.email).returns(Promise.resolve(userFix));
    questionServiceStub.findAll.returns(Promise.resolve(questionsFix));
    questionServiceStub.findById.withArgs("1").returns(Promise.resolve(questionFix));
    questionServiceStub.findById.withArgs("2").returns(Promise.resolve({
        _id: questionFix._id,
        title: questionFix.title,
        description: questionFix.description,
        icon: questionFix.icon,
        answers: [],
        save: function save() {
            return Promise.resolve();
        }
    }));
    questionServiceStub.createQuestion.withArgs(newQuestionFix).returns(Promise.resolve(questionFix));
    answerServiceStub.createAnswer.withArgs(answerFix).returns(Promise.resolve(answerFix));
    api = (0, _proxyquire2.default)('../api', {
        './config/auth': config,
        'platzi-overflow-db': function platziOverflowDb() {
            return {
                questionService: questionServiceStub,
                userService: userServiceStub,
                answerService: answerServiceStub
            };
        }
    });

    server = (0, _proxyquire2.default)('../server', {
        './api': api
    });
});

_ava2.default.afterEach(function (t) {
    if (sandbox) {
        sandbox.restore();
    }
});

_ava2.default.serial.cb('GET /api/questions', function (t) {
    (0, _supertest2.default)(server).get('/api/questions').expect('Content-Type', /json/).expect(200).end(function (err, res) {
        t.deepEqual(questionsFix, res.body, 'Objects should be equal');
        t.deepEqual(questionsFix.length, res.body.length, 'Objects should be the same length');
        t.true(questionServiceStub.findAll.called, 'Function should be called');
        t.end();
    });
});

_ava2.default.serial.cb('GET /api/questions/:id', function (t) {
    (0, _supertest2.default)(server).get('/api/questions/1').expect('Content-Type', /json/).expect(200).end(function (err, res) {
        t.deepEqual(questionFix, res.body, 'Objects should be equal');
        t.true(questionServiceStub.findById.called, 'Function should be called');
        t.end();
    });
});

_ava2.default.serial.cb('POST /api/questions/', function (t) {
    (0, _supertest2.default)(server).post('/api/questions/').send({
        title: questionFix.title,
        description: questionFix.description,
        icon: questionFix.icon
    }).set('Accept', 'application/json').set('Authorization', 'Bearer ' + token).expect('Content-Type', /json/).expect(201).end(function (err, res) {
        t.deepEqual(questionFix, res.body, 'Objects should be equal');
        t.true(questionServiceStub.createQuestion.called, 'Function should be called');
        t.end();
    });
});

_ava2.default.serial.cb('POST api/questions error', function (t) {
    (0, _supertest2.default)(server).post('/api/questions').send({
        title: questionFix,
        description: questionFix,
        icon: questionFix
    }).expect('Content-Type', /json/).expect(401).end(function (err, res) {
        t.deepEqual(res.body, errorAuth, 'Objects should be equals');
        t.false(config.getToken.called, 'Function should  be ignore');
        t.end();
    });
});

_ava2.default.serial.cb('POST /api/questions/:id/answers', function (t) {
    (0, _supertest2.default)(server).post('/api/questions/2/answers').send({
        description: answerFix.description
    }).set('Authorization', 'Bearer ' + token).expect(201).expect('Content-Type', /json/).end(function (err, res) {
        t.deepEqual(res.body, answerFix, 'Object should be equal');
        t.end();
    });
});

_ava2.default.serial.cb('POST /api/questions/:id/answers error', function (t) {
    (0, _supertest2.default)(server).post('/api/questions/1/answers').send({
        description: answerFix.description,
        question: answerFix.question
    }).expect(401).expect('Content-Type', /json/).end(function (err, res) {
        t.deepEqual(res.body, errorAuth, 'Object should be equal');
        t.end();
    });
});

_ava2.default.serial.cb('POST /api/auth/signin', function (t) {
    (0, _supertest2.default)(server).post('/api/auth/signin').send({
        email: userFix.email,
        password: userFix.password
    }).expect(200).expect('Content-Type', /json/).end(function (err, res) {
        var logedUser = {
            message: 'Login success',
            token: token,
            userId: userFix._id,
            email: userFix.email,
            firstName: userFix.firstName,
            lastName: userFix.lastName
        };
        t.deepEqual(res.body, logedUser, 'Objects should be equal');
        t.true(config.getToken.called, 'Function should be called');
        t.end();
    });
});

_ava2.default.serial.cb('POST api/auth/signup', function (t) {
    (0, _supertest2.default)(server).post('/api/auth/signup').send({
        firstName: userFix.firstName,
        lastName: userFix.lastName,
        email: userFix.email,
        password: userFix.password
    }).expect(201).expect('Content-Type', /json/).end(function (err, res) {
        var logedUser = {
            message: 'User created',
            token: token,
            userId: userFix._id,
            email: userFix.email,
            firstName: userFix.firstName,
            lastName: userFix.lastName
        };
        t.deepEqual(logedUser, res.body, 'Objects should be equals');
        t.true(config.getToken.called, 'Funtion should be called');
        t.end();
    });
});