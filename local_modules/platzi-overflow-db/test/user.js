'use strict'

const test= require('ava');
const sinon= require('sinon');
const proxyquire= require('proxyquire');
const fixtures=require('../fixtures');
let sandbox=null;
let dbSetup= null;

class UserStub{
    constructor(){}
    static findOne(){}
    save(){}
}

test.beforeEach((t)=>{
    sandbox= sinon.createSandbox();
    sandbox.stub(UserStub.prototype,'constructor').withArgs(fixtures.newUser)
    .returns(new UserStub());
    sandbox.stub(UserStub.prototype,'save').returns(Promise.resolve(fixtures.newUser));
    sandbox.stub(UserStub,'findOne').withArgs({email:fixtures.newUser.email})
    .returns(Promise.resolve(fixtures.newUser));
    
    dbSetup=proxyquire('../',{
        './model/user':UserStub
    });

})

test.afterEach((t)=>{
    if(sandbox){
        sandbox.restore();
    }
})

test.serial('User createUser',async (t)=>{
    let newUser= await dbSetup().userService.createUser(fixtures.newUser);
    t.deepEqual(newUser,fixtures.newUser,'Objects should be equals');
    t.true(UserStub.prototype.save.called,'Function should be called');
})

test.serial('User findByEmail',async (t)=>{
    let user= await dbSetup().userService.findByEmail(fixtures.newUser.email);
    t.deepEqual(user,fixtures.newUser,'Objects should be equals');
    t.true(UserStub.findOne.called,'Function should be called');
})