const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
})

//creating the model
//keep the name capital as it is a like a class , so when we are gonna create a new user we will
//create instance of this.
const User = mongoose.model("User", userSchema);
module.exports = User;