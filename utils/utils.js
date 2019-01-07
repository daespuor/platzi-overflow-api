export const findUserByEmail= (email,users)=>(users.find((user)=>{
    return user.email===email
}));

export const comparePasswords=(original,newest)=>(original===newest);

export const handleLoginFail=(res)=>{
    return res.status(401).json({
        message:'Email or password are invalid',
        error: 'Login failed'
    });
}
