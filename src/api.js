'use strict'

const express = require('express');
const asyncify= require('express-asyncify');
const Debug = require('debug');
const debug= new Debug('platzi-overflow:auth');
const db= require('platzi-overflow-db');
const properties=require('./config/properties');
const config=require('./config/auth');
const {getError,handleError} = require('./middlewares/index');
const utils= require('./utils/utils');
const auth= require('express-jwt');
const api= asyncify(express.Router());
let dbSetup=null;


api.use((req,res,next)=>{
    dbSetup= db();
    next();
})

api.get('/questions',async (req,res)=>{
    try{
        const {sort}=req.query;
        const questions=await dbSetup.questionService.findAll(sort);
        res.status(200).json(questions);
    }catch(err){
        handleError(err);
    }
});

api.get('/questions/:id',async (req,res)=>{
    try{
        const question=await dbSetup.questionService.findById(req.params.id);
        res.status(200).json(question);
    }catch(err){
        handleError(err);
    }
});

api.post('/questions',auth({secret:properties.secret}),async (req,res)=>{
    const {icon, description, title}= req.body;
    try{
        const newQuestion={
            title,
            description,
            icon,
            user:req.user.user._id,
            answers:[]
        }
        const question=await dbSetup.questionService.createQuestion(newQuestion);
        res.status(201).json(question);
    }catch(err){
        handleError(err);
    }
    
});

api.post('/questions/:id/answers',auth({secret:properties.secret}),async (req,res)=>{
    try{
        const currQuestion= await dbSetup.questionService.findById(req.params.id);
        const {description}= req.body;
        const answer={
            description,
            question:currQuestion._id,
            user:req.user.user._id
        }
       
        const newAnswer=await dbSetup.answerService.createAnswer(answer);
        currQuestion.answers.push(newAnswer);
        await currQuestion.save();
        res.status(201).json(newAnswer);
    }catch(err){
        handleError(err);
    }
});

api.post('/auth/signin',async (req,res,next)=>{
    const {email, password} = req.body;
    try{
        const user=await dbSetup.userService.findByEmail(email);

        if(!user){
            debug(`Email or password are invalid: Email:${email}, Password:${password}`)
            return utils.handleLoginFail(res);
        }

        if(!utils.comparePasswords(password,user.password)){
            debug(`Password invalid: password ${password}`);
            return utils.handleLoginFail(res);
        }
        const token=config.getToken(user);
        res.status(200).json({
            message:'Login success',
            token,
            userId:user._id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName
        })
    }catch(err){
        handleError(err);
    }
});

api.post('/auth/signup',async (req,res,next)=>{
    try{
        let newUser=await dbSetup.userService.createUser(req.body);
        const token= config.getToken(newUser);
        res.status(201).json({
            message:'User created',
            token,
            userId:newUser._id,
            email:newUser.email,
            firstName:newUser.firstName,
            lastName:newUser.lastName
        })
    }catch(err){
        handleError(err);
    }
});

api.use(getError);

module.exports=api;