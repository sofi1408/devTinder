const mongoose = require('mongoose');

const connectDB = mongoose.connect('mongodb+srv://sofi1408:Trm9jmxptdmUw8pj@namastenode.a9ktg.mongodb.net/devTinder');

module.exports = {connectDB};

//moving this to app.js, as we need to only start listening after db is successfully connected.

// connectDB.then(() => {
//     console.log('DB connected succesfully');
// }).catch(err => console.log('Error Connecting DB: ', err));
