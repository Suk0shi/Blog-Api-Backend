const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const { DateTime } = require("luxon");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const asyncHandler = require("express-async-handler");

// Handle book create on POST.
exports.comment_create_post = [
  
    // Validate and sanitize fields.
    body("name", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("text", "Text must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    // Process request after validation and sanitization.
  
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a Book object with escaped and trimmed data.
      const comment = new Comment({
        name: req.body.name,
        date: DateTime.fromJSDate(new Date()).toLocaleString(DateTime.DATE_MED),
        text: req.body.text,
        post: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        res.send({
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save book.
        await comment.save();
        res.json({comment: "Comment Sent"})
      }
    }),
  ];

  exports.comment_delete_post = asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, `${process.env.JWT_KEY}`,async (err, authData) => {
      if(err) {
        res.json('Login required')
      } else { 
          await Comment.findByIdAndDelete(req.params.id);
          
          res.json("Comment Deleted");
      }})
  });

