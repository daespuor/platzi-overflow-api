const question={
    _id:1,
    title:'¿Por que ese programa es tan malo?',
    description:'Esta es una pregunta...',
    createdAt:new Date(),
    icon:'devicon-android-plain',
    answers:[],
    user:{
        firstname:'Daniel',
        lastname:'Puerta',
        email:'daespuor@hotmail.com',
        password:'123456'
    }
}
const newQuestion={
    _id: + new Date(),
    createdAt: new Date(),
    answers:[],
    user:{
        firstname:'Daniel',
        lastname:'Puerta',
        email:'daespuor@hotmail.com',
        password:'123456'
    }
}
const newAnswer={
    createdAt: new Date(),
    user:{
        firstname:'Daniel',
        lastname:'Puerta',
        email:'daespuor@hotmail.com',
        password:'123456'
    }
}
const questions=new Array(10).fill(question);

module.exports= {
    question,
    questions,
    newQuestion,
    newAnswer
}