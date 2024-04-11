const express = require("express");
const router = express.Router();

// Require controller modules.
const comment_controller = require("../controllers/commentController");
const post_controller = require("../controllers/postController");
const user_controller = require("../controllers/userController");

router.get("/posts", post_controller.posts);

router.get("/unpublished", verifyToken, post_controller.unpublished);

router.post("/post", verifyToken, post_controller.post_post);

router.post("/post/:id/update", verifyToken, post_controller.update_post);

router.post("/post/:id/delete", verifyToken, post_controller.delete_post);

router.get("/post/:id", post_controller.post_detail);

router.get("/login", user_controller.login);

router.get("/signUp", user_controller.signUp);

router.post("/signUp", verifyToken, user_controller.signUp_post);

router.post("/comment/:id", comment_controller.comment_create_post);

router.post("/comment/:id/delete", verifyToken, comment_controller.comment_delete_post);

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value 
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.json('Login required')
    }
}

module.exports = router;