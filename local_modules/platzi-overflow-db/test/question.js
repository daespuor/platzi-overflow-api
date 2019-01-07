'use strict'


const test= require('ava');
const sinon= require('sinon');
const proxyquire= require('proxyquire');
const fixtures= require('../fixtures');
let sandbox=null;
let dbSetup=null;
const where ={
    path:'answers',
    options:{sort:'-createdAt'},
    populate:{
        path:'user',
        model:'User'
    }
}

class QuestionStub{
    constructor(){}
    static find(){}
    static findOne(){}
    save(){}
}

class AnswerStub{
    constructor(){}
    save(){}
}

test.beforeEach((t)=>{
    sandbox= sinon.createSandbox();
    
    sandbox.stub(QuestionStub.prototype,'constructor')
    .withArgs(fixtures.newQuestion).returns(new QuestionStub());
    sandbox.stub(AnswerStub.prototype,'constructor')
    .withArgs(fixtures.answer).returns(new AnswerStub());
    sandbox.stub(AnswerStub.prototype,'save').returns(Promise.resolve(fixtures.answer));
    sandbox.stub(QuestionStub,'find').returns({
        populate:(name)=>(
            {sort:(param)=>{
                return Promise.resolve(fixtures.questions);
            }}
        )
    });
    sandbox.stub(QuestionStub.prototype,'save').returns(Promise.resolve(fixtures.newQuestion));
    sandbox.stub(QuestionStub,'findOne').withArgs({_id:fixtures.question._id})
    .returns({
        populate:(name)=>{
            return {
                populate:(where)=>{
                    return Promise.resolve(fixtures.question)
                }
            }
        }
    });
   
    dbSetup=proxyquire('../',{
        './model/question':QuestionStub,
        './model/answer':AnswerStub
    });
});

test.afterEach((t)=>{
    if(sandbox){
        sandbox.restore();
    }
});

test.serial('Question - findAll',async (t)=>{
    let questions=await dbSetup().questionService.findAll();
    t.deepEqual(questions,fixtures.questions,'Objects should be equals');
    t.true(QuestionStub.find.called,'Function should be called');
});

test.serial('Question - create',async (t)=>{
    let question = await dbSetup().questionService.createQuestion(fixtures.newQuestion);
    t.deepEqual(question,fixtures.newQuestion,'Objects should be equals');
    t.true(QuestionStub.prototype.save.called,'Function should be called');
})

test.serial('Question - findbyID',async(t)=>{
    let question= await dbSetup().questionService.findById(fixtures.question._id);
    t.deepEqual(question,fixtures.question,'Object should be equals');
    t.true(QuestionStub.findOne.called,'Function should be called');
})

test.serial('Answer - create',async(t)=>{
    let answer= await dbSetup().answerService.createAnswer(fixtures.answer);
    t.deepEqual(fixtures.answer,answer,'Objects should be equals');
    t.true(AnswerStub.prototype.save.called,'Function should be called');
})