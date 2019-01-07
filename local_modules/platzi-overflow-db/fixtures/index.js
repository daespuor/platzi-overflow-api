const question={
    _id:1,
    title:'Pregunta 1',
    description:'Esta es una descripcion',
    createdAt:'12/12/2018',
    icon:'icono-prueba',
    answers:[],
    user:{
        _id:1,
        firstName:'Daniel',
        lastName:'Puerta',
        email:'daespuor@hotmail.com',
        password:'123456'   
    }
}

const answer={
    _id:1,
    description:'Esta es una descripcion',
    createdAt:'12/12/2018',
    question:{},
    user:{}
}

const questions=new Array(10).fill(question);

const newQuestion= Object.assign({_id:2},question);


const newUser= {
        _id:1,
        firstName:'Daniel',
        lastName:'Puerta',
        email:'daespuor@hotmail.com',
        password:'123456'   
}

module.exports={
    question,
    questions,
    newQuestion,
    newUser,
    answer
}

