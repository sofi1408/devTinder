require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = mongoose.connect(process.env.MONGO_URI);

module.exports = {connectDB};

//moving this to app.js, as we need to only start listening after db is successfully connected.

// connectDB.then(() => {
//     console.log('DB connected succesfully');
// }).catch(err => console.log('Error Connecting DB: ', err));
