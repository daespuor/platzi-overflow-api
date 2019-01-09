const model = require('../models/questions');
const questions=model.questions;

export const getQuestion=(req,res,next)=>{
    const question= questions.find((question)=>question._id===+req.params.id);
    req.question=question;
    next();
}

export const getError=(err,req,res,next)=>{
    if(err.name==='UnauthorizedError'){
        res.status(401)
        .json({
            message:'Unauthorized User',
            error: 'Login failed'
        })
    }
}

export const handleError=(err,res)=>{
    res.send(500)
    .json({
        message:`An error ocurr: ${err.message}`,
        error:'Server Error'
    })
}