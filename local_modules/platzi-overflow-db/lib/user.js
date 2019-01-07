'use strict'

const debug= require('debug')('platzi-overflow:db');


module.exports=(User)=>{
    async function createUser(user){
        debug('Time to create a user');
        const newUser = new User(user);
        return await newUser.save();
    }

    async function findByEmail(email){
        debug('Time to find one user');
        return await User.findOne({email});
    }

    return {
        findByEmail,
        createUser
    }
}
