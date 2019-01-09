'use strict'

import test from 'ava';
import request from 'supertest';
import fixis from '../fixtures/fixtures';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import fixtures from '../fixtures/fixtures';
const questionsFix=fixis.questions;
const questionFix= fixis.question;
const answerFix=fixis.newAnswer;
const userFix=fixis.user;
const token= fixis.token;
const newUserFix=fixis.newUser;
const newQuestionFix=fixis.newQuestion;
let sandbox=null;
const errorAuth={
    message:'Unauthorized User',
    error: 'Login failed'
}
let questionServiceStub=null;
let userServiceStub=null;
let answerServiceStub=null;
let server=null;
let api=null;
let config=null;

test.beforeEach((t)=>{
    sandbox=sinon.createSandbox();
    config={
        getToken:sandbox.stub()
    }
    userServiceStub={
        createUser:sandbox.stub(),
        findByEmail:sandbox.stub()
    }
    questionServiceStub={
        findAll:sandbox.stub(),
        createQuestion:sandbox.stub(),
        findById:sandbox.stub(),
        updateQuestion:sandbox.stub()
    }
    answerServiceStub={
        createAnswer:sandbox.stub()
    }

    config.getToken.withArgs(userFix).returns(token);
    config.getToken.withArgs(newUserFix).returns(token);
    userServiceStub.createUser.withArgs(newUserFix).returns(Promise.resolve(userFix));
    userServiceStub.findByEmail.withArgs(userFix.email).returns(Promise.resolve(userFix));
    questionServiceStub.findAll.returns(Promise.resolve(questionsFix));
    questionServiceStub.findById.withArgs("1").returns(Promise.resolve(questionFix));
    questionServiceStub.findById.withArgs("2").returns(Promise.resolve({
        _id:questionFix._id,
        title:questionFix.title,
        description:questionFix.description,
        icon:questionFix.icon,
        answers:[],
        save:()=>{
            return Promise.resolve();
        }
    }));
    questionServiceStub.createQuestion.withArgs(newQuestionFix).returns(Promise.resolve(questionFix));
    answerServiceStub.createAnswer.withArgs(answerFix).returns(Promise.resolve(answerFix));
    api=proxyquire('../api',{
        './config/auth':config,
        'platzi-overflow-db':()=>(
            {
                questionService:questionServiceStub,
                userService:userServiceStub,
                answerService:answerServiceStub
            }
        )
    });

    server= proxyquire('../server',{
        './api':api
    });
});

test.afterEach((t)=>{
    if(sandbox){
        sandbox.restore();
    }
})

test.serial.cb('GET /api/questions',(t)=>{
    request(server)
    .get('/api/questions')
    .expect('Content-Type',/json/)
    .expect(200)
    .end((err,res)=>{
        t.deepEqual(questionsFix,res.body,'Objects should be equal');
        t.deepEqual(questionsFix.length,res.body.length,'Objects should be the same length');
        t.true(questionServiceStub.findAll.called,'Function should be called');
        t.end();
    });
    
})

test.serial.cb('GET /api/questions/:id',(t)=>{
    request(server)
    .get('/api/questions/1')
    .expect('Content-Type',/json/)
    .expect(200)
    .end((err,res)=>{
        t.deepEqual(questionFix,res.body,'Objects should be equal');
        t.true(questionServiceStub.findById.called,'Function should be called');
        t.end();
    });
})

test.serial.cb('POST /api/questions/',(t)=>{
    request(server)
    .post('/api/questions/')
    .send({
        title:questionFix.title,
        description:questionFix.description,
        icon:questionFix.icon
    })
    .set('Accept','application/json')
    .set('Authorization',`Bearer ${token}`)
    .expect('Content-Type',/json/)
    .expect(201)
    .end((err,res)=>{
        t.deepEqual(questionFix,res.body,'Objects should be equal');
        t.true(questionServiceStub.createQuestion.called,'Function should be called');
        t.end();
    });
})

test.serial.cb('POST api/questions error',(t)=>{
    request(server)
    .post('/api/questions')
    .send({
        title:questionFix,
        description:questionFix,
        icon:questionFix
    })
    .expect('Content-Type',/json/)
    .expect(401)
    .end((err,res)=>{
        t.deepEqual(res.body,errorAuth,'Objects should be equals');
        t.false(config.getToken.called,'Function should  be ignore');
        t.end();
    })
})

test.serial.cb('POST /api/questions/:id/answers',(t)=>{
    request(server)
    .post('/api/questions/2/answers')
    .send({
        description:answerFix.description
    })
    .set('Authorization',`Bearer ${token}`)
    .expect(201)
    .expect('Content-Type',/json/)
    .end((err,res)=>{
        t.deepEqual(res.body,answerFix,'Object should be equal');
        t.end();
    });
})

test.serial.cb('POST /api/questions/:id/answers error',(t)=>{
    request(server)
    .post('/api/questions/1/answers')
    .send({
        description:answerFix.description,
        question:answerFix.question
    })
    .expect(401)
    .expect('Content-Type',/json/)
    .end((err,res)=>{
        t.deepEqual(res.body,errorAuth,'Object should be equal');
        t.end();
    });
})

test.serial.cb('POST /api/auth/signin',(t)=>{
    request(server)
    .post('/api/auth/signin')
    .send({
        email:userFix.email,
        password:userFix.password
    })
    .expect(200)
    .expect('Content-Type',/json/)
    .end((err,res)=>{
        const logedUser={
            message:'Login success',
            token,
            userId:userFix._id,
            email:userFix.email,
            firstName:userFix.firstName,
            lastName:userFix.lastName
        }
        t.deepEqual(res.body,logedUser,'Objects should be equal');
        t.true(config.getToken.called,'Function should be called');
        t.end();
    })
})

test.serial.cb('POST api/auth/signup',(t)=>{
    request(server)
    .post('/api/auth/signup')
    .send({
        firstName:userFix.firstName,
        lastName:userFix.lastName,
        email:userFix.email,
        password:userFix.password
    })
    .expect(201)
    .expect('Content-Type',/json/)
    .end((err,res)=>{
        const logedUser={
            message:'User created',
            token,
            userId:userFix._id,
            email:userFix.email,
            firstName:userFix.firstName,
            lastName:userFix.lastName
        }
        t.deepEqual(logedUser,res.body,'Objects should be equals');
        t.true(config.getToken.called,'Funtion should be called');
        t.end();
    })

})