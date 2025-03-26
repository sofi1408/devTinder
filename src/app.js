const express = require("express");
const app = express();
const port = 4357;

const {connectDB} = require('./config/database');
const User = require("./models/user");
const bcrypt = require('bcrypt');

const {validateSignUpData, validateSignInData} = require('./utils/validation')

app.use(express.json())


app.post('/signup', async (req, res) => {
 try{
   //validation of data
   validateSignUpData(req);

   //encrypt password
   const {firstName, lastName, emailId, password} = req.body;

   //with this passwordhash is generated but we cannot decrypt it.
   const passwordHash = await bcrypt.hash(password, 10)

   //const user = new User(req.body) - never trust request body and pass it like this.
   //always pass the required fields only to prevent it from attacks.
   const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash
   })
     await user.save();
     res.status(200).send("user created successfully")
   }
   catch(err){
    res.status(400).send('Error: ' + err.message);
   };
});

app.get('/signin', async(req, res) => {
    try{
        await validateSignInData(req);
        res.status(200).send("Login Successful")
    }
    catch(err){
        res.status(400).send('Error: ' + err.message);
    };
})

// get user by emai
app.get('/user', async (req, res) => {
   try{
    const email = req.body.emailId;
    const user = await User.find({emailId: email});
    if(user.length === 0){
        res.status(404).send("user not found")
    }
    else{
        res.status(200).send(user)
    }
   }
   catch(err){
    res.status(400).send('Something went wrong' + err.message);
   }
 
})

//feed api to get all the users

app.get('/feed', async (req, res) => {
    try{
        const users = await User.find({});
        res.status(200).send(users)
    }
    catch(err){
        res.send('Error fetching users..' + err.message);
    }
})

// delete user
// need to put more checks to validate it

app.delete('/user', async (req, res) => {
    try{
        const email = req.body.emailId;
        await User.deleteOne({emailId: email});
        res.status(200).send("user deleted successfully...")
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

// update data of user

app.patch('/user/:id', async(req, res) => {
    try{
        const userId = req.params.id;
        const data = req.body;

        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));

        if(!isUpdateAllowed){
           throw new Error("Update not allowed...")
        }

        if(data?.skills?.length > 10){
            throw new Error("More than 10 skills are not allowed...")
        }

        await User.findByIdAndUpdate(userId, data, {
            runValidators: true,
            returnDocument: "after",
        })
        res.status(200).send("user updated successfully...")
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

connectDB.then(() => {
    app.listen(port, () => {
        console.log('Listening to port: ', port);
    })
}).catch(err => console.log('Error Connecting DB: ', err));

