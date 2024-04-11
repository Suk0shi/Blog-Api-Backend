const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { DateTime } = require("luxon");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Display detail page for a specific Author.
exports.posts = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [post, comments] = await Promise.all([
      Post.find( {published: true} ).exec(),
      Comment.find().exec(),
    ]);
  
    if (post === null) {
      // No results.
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }

    res.json({
    title: "Post",
    post: post,
    post_comments: comments,
    });
  
});

exports.unpublished = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [post, comments] = await Promise.all([
    Post.find( {published: false} ).exec(),
    Comment.find().exec(),
  ]);

  jwt.verify(req.token, `${process.env.JWT_KEY}`,(err, authData) => {
    if(err) {
      res.json('Login required')
    } else {
    
      if (post === null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }
    
      res.json({
        title: "Post",
        post: post,
        post_comments: comments,
      });
    }
  })
});

exports.post_post = [
    // Validate and sanitize fields.
    body("name", "Please type a name")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("title", "Please type a title")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("text", "Please type a message to send")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("published", "Please indicate publication status")
      .escape(),
    // Process request after validation and sanitization.
  
    asyncHandler(async (req, res, next) => {
      jwt.verify(req.token, `${process.env.JWT_KEY}`,async (err, authData) => {
        if(err) {
          res.json('Login required')
        } else {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        let published = false;

        if (req.body.published === "on") {
          published = true;
        }
      
        // Create a User object with escaped and trimmed data.
        const post = new Post({
          name: req.body.name,
          date: DateTime.fromJSDate(new Date()).toLocaleString(DateTime.DATE_MED),
          title: req.body.title,
          text: req.body.text,
          published: published,
        });
    
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
          res.json({
            title: "Post",
            post: post,
            post_comments: comments,
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save user.
          await post.save();
          res.json("post sent")
        }
      }
    })
    })
  ];

  exports.post_detail = asyncHandler(async (req, res, next) => {
    // Get details of post and all their comments (in parallel)
    const [post, allCommentsForPost] = await Promise.all([
      Post.findById(req.params.id).exec(),
      Comment.find({ post: req.params.id }).exec(),
    ]);
  
    if (post === null) {
      // No results.
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }
  
    res.json({
      title: "Post Detail",
      post: post,
      post_comments: allCommentsForPost,
    });
});

exports.update_post = [

  // Validate and sanitize fields.
  body("name", "Please type a name")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("title", "Please type a title")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("text", "Please type a message to send")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("published", "Please indicate publication status")
      .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, `${process.env.JWT_KEY}`,async (err, authData) => {
      if(err) {
        res.json('Login required')
      } else {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        let published = false;
    
        if (req.body.published === "on") {
          published = true;
        }
    
        const post = new Post({
          name: req.body.name,
          date: 'Updated: ' + DateTime.fromJSDate(new Date()).toLocaleString(DateTime.DATE_MED),
          title: req.body.title,
          text: req.body.text,
          published: published,
          _id: req.params.id,
        });
        
          // Data from form is valid. Update the record.
          await Post.findByIdAndUpdate(req.params.id, post, {});
          // Redirect to book detail page.
          res.json(`post updated`)

      }})
      
  }),
];

exports.delete_post = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, `${process.env.JWT_KEY}`,async (err, authData) => {
    if(err) {
      res.json('Login required')
    } else { 
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ post: req.params.id });
        
        res.json("Post Deleted");
    }})
});