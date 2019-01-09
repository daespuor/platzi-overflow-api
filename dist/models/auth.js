'use strict';

var user = {
    firstName: 'Daniel',
    lastName: 'Puerta',
    email: 'daespuor@hotmail.com',
    password: '123456',
    _id: 1
};

var newUser = {
    _id: +new Date()
};

module.exports = {
    user: user,
    newUser: newUser
};