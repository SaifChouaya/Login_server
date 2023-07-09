const express = require('express');
const router = express.Router();

// Import required modules
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name === "" || email === "" || password === "" || dateOfBirth === "") {
        return res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    }

    if (!/^[a-zA-Z\s]*$/.test(name)) {
        return res.json({
            status: "FAILED",
            message: "Invalid name entered!"
        });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "FAILED",
            message: "Invalid email entered!"
        });
    }

    if (!new Date(dateOfBirth).getTime()) {
        return res.json({
            status: "FAILED",
            message: "Invalid date of birth entered!"
        });
    }

    if (password.length < 8) {
        return res.json({
            status: "FAILED",
            message: "Password is too short!"
        });
    }

    // Check if user already exists
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                });
            }

            // Create new user
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds)
                .then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    });

                    newUser.save()
                        .then(result => {
                            res.json({
                                status: "SUCCESS",
                                message: "Signup successful",
                                data: result
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving user account!"
                            });
                        });
                });
        })
        .catch(error => {
            console.log(error);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            });
        });
});

// Signin
router.post('/signin', (req, res) => {
    // Implement the user signin functionality here
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password==""){
        res.json({
            status: "FAILED",
            massage: "Empty credentials supplied"
        })
    }else{
        //check if user exist
        User.find({email})
        .then(data => {
            if(data.length) {
                //user exists

                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result){
                        res.json({
                            status: "SUCCESS",
                            message: "Signin successful",
                            data: data
                        });
                    }else{
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        });
                    }
                })
                .catch(error => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while comparing passwords"
                    });
                })
            }else{
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!"
                });
            };
        })
        .catch(error => {
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user"
            });
        })
    }
});

module.exports = router;



