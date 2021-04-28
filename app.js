//jshint esversion:6



// Packages Declaration
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//server setput

//express app declaration
const app = express();
//Mongoose connect to mongod
mongoose.connect("mongodb://localhost:27017/userDb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//WORKING SETUP

//Schema declaration
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
//static folder declaration
app.use(express.static('public'));
//view engine declaration
app.set('view engine', 'ejs');
//declaring that we are using the body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
//declaring mongoose model
const User = mongoose.model('User', userSchema);



//ROUTES

//home route
app.route('/').get((req, res) => {
    res.render('home')
})


//login route
app.route('/login').get((req, res) => {
    res.render('login')
}).post((req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
        email: userName
    }, (err, user) => {
        if (err) {
            res.send("You have not loged in from this email address")
        } else if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === true) {
                    res.render('Secrets')
                }
                if(err){
                    console.log(err)
                }
            });
        }
    })
})


//register route
app.route('/register').get((req, res) => {
    res.render('register')
}).post((req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err) => {
            if (err) {
                res.send(err)
            } else {
                res.render('secrets')
            }
        });
    });
})



// server setup 

// Making tha app listen to port 3000

app.listen(3000, () => {
    console.log('app started at port 3000')
});