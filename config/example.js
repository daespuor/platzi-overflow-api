const config = require('./auth');

const user={
    firstName:'Daniel',
    lastName:'Puerta',
    email:'daespuor@hotmail.com',
    password:'123456',
    _id:1
}

console.log(config.getToken(user));