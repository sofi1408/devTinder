const validator = require('validator');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body

    if(!firstName || !lastName){
        throw new Error("Enter a valid name")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email Id is not valid")
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}

const validateSignInData = async (req, res) => {
    const {emailId, password} = req.body;
    if(!emailId || !password){
        throw new Error("Please provide mandatory fields")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Please provide valid email id")
    }
    else {
      const user = await User.findOne({emailId});
      if(!user){
        throw new Error("Invalid Credentials")
      }
      const isValidPassword = await bcrypt.compare(password, user.password )
      if(!isValidPassword){
        throw new Error("Invalid Credentials")
      }
      else{
        //create a jwt token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET , { expiresIn: '7d' }); 
        //store it into the cookie
        res.cookie("token", token);
      }
    }
}

module.exports = {validateSignUpData, validateSignInData}