const express = require("express");
const app = express();
const port = 4357;

const {connectDB} = require('./config/database');
const User = require("./models/user");

app.use(express.json())


app.post('/signup', async (req, res) => {
   const user = new User(req.body)
   try{
     await user.save();
     res.status(200).send("user created successfully")
   }
   catch(err){
    console.log("error is: ", err);
    res.status(400).send('error creating user' + err.message);
   };
});

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

