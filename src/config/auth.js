const jwt = require('jsonwebtoken');
const properties= require('./properties');

const getToken=(user)=>{
    //return jwt.sign({user},properties.secret,{expiresIn:86400});
    return jwt.sign({user},properties.secret);
}

module.exports={
    getToken
}


