const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)
    
  
    res.json({
      title: "Login",
      user: req.user
    });
});

exports.signUp = asyncHandler(async (req, res, next) => {
    res.json({
        title: "Sign Up"
    });
});

exports.signUp_post = [
    // Validate and sanitize fields.
    body("username", "Name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("password", "Password must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("passwordConfirm", "Password confirmation must match")
      .custom((value, { req }) => {
        return value === req.body.password;
      }),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
      jwt.verify(req.token, `${process.env.JWT_KEY}`,(err, authData) => {
        if(err) {
          res.json('Login required')
        } else {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        // Create a User object with escaped and trimmed data.
        const user = new User({
          username: req.body.username,
          password: hashedPassword
        });
    
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
    
          res.json({
            title: "Sign Up",
            user: user,
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save user.
          await user.save();
          res.json("user created");
        }
        })
      }})
    })
];
