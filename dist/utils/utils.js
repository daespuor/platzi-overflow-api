'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var findUserByEmail = exports.findUserByEmail = function findUserByEmail(email, users) {
    return users.find(function (user) {
        return user.email === email;
    });
};

var comparePasswords = exports.comparePasswords = function comparePasswords(original, newest) {
    return original === newest;
};

var handleLoginFail = exports.handleLoginFail = function handleLoginFail(res) {
    return res.status(401).json({
        message: 'Email or password are invalid',
        error: 'Login failed'
    });
};