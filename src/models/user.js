const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
      // this will be called only on new data creation and not on existing data
      // for this use the runvalidators method in update call.
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Please enter a valid email id')
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String
    },
    about: {
        type: String,
        default: "Hello from Dev Tinder"
    },
    skills: {
        type: [String],
    }
}, {timestamps: true})

//creating the model
//keep the name capital as it is a like a class , so when we are gonna create a new user we will
//create instance of this.
const User = mongoose.model("User", userSchema);
module.exports = User;