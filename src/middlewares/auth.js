
const jwt = require('jsonwebtoken')
require('dotenv').config();
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error('Invalid Token')
        }
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const {id} = tokenData;
        const user = await User.findById(id);
        if(!user){
            throw new Error("User not Found")
        } 
        //attaching user to request to access in my req handler
        req.user = user;
        next();
    }
    catch(error){
        res.status(400).send('Error: ' + error.message);
    }
    
}

module.exports = {userAuth}