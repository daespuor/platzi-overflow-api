'use strict'
const debug= require('debug')('platzi-overflow:db')

module.exports=(Question)=> {
    async function findAll(sort="-createdAt"){
        debug('Time to find all questions');
        return await Question.find().populate('answers').sort(sort);
    }
    async function createQuestion(question){
        debug('Creating a question');
        const newQuestion= new Question(question);
        return await newQuestion.save();

    }
    async function findById(id){
        debug(`Time to find one question by ${id}`);
        return await Question.findOne({_id:id})
        .populate('user')
        .populate({
            path:'answers',
            options:{sort:'-createdAt'},
            populate:{
                path:'user',
                model:'User'
            }
        });
    }
    return {
        findAll,
        findById,
        createQuestion
    }
}