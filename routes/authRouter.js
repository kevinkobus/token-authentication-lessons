const express = require("express");
const User = require("../models/User");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

// Signup
authRouter.post("/signup", (req, res, next) => {
  //check if the username already exists
  User.findOne({ username: req.body.username.toLowerCase() })
    // if the username already exists, return error message if it does
    .then((user) => {
      if (user) {
        res.status(403);
        return next(new Error("This username already exists"));
      }
      // saving the new user
      const newUser = new User(req.body);
      // saving to the db
      newUser
        .save()
        .then((savedUser) => {
          // return the token and user (payload, secret from .env)
          const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);
          return res.status(200).send({ token, user: savedUser.withoutPassword() });
        })
        .catch((err) => {
          res.status(500);
          return next(err);
        });
    });
});

// Login
authRouter.post("/login", (req, res, next) => {
  // check if login info exists and/or is accurate
  User.findOne({ username: req.body.username.toLowerCase() })
    .then((user) => {
      // if doesn't exist and/or is not accurate throw this error message
      if (!user) {
        res.status(403);
        return next(new Error("Username or Password are incorrect"));
      }
      // manual way to check if password is correct
      // if (req.body.password !== user.password) {
      //   res.status(403)
      //   return next(new Error("Username or Password are incorrect"))
      // }
      // bcrypt way of checking if password is correct
      user.checkPassword(req.body.password, (err, isMatch) => {
        if(err){
          res.status(403)
          return next(new Error("Username and/or Password are incorrect"))
        }
        if(!isMatch){
          res.status(403)
          return next(new Error("Username and/or Password are incorrect"))
        }
      })
      // otherwise return the token and user (payload, secret from .env)
      const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
      return res.status(200).send({ token, user: user.withoutPassword() });
    })
    .catch((err) => {
      res.status(500);
      return next(err);
    });
});

module.exports = authRouter;