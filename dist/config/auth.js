'use strict';

var jwt = require('jsonwebtoken');
var properties = require('./properties');

var getToken = function getToken(user) {
    //return jwt.sign({user},properties.secret,{expiresIn:86400});
    return jwt.sign({ user: user }, properties.secret);
};

module.exports = {
    getToken: getToken
};