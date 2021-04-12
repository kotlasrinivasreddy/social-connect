
const express= require('express');
const {getPosts, createPost, getPostsByUser, postById, isPoster, deletePostById, updatePostById} = require('../controller/post');
const {requireSignin} = require('../controller/auth');
const {userById} = require('../controller/user');
const validator= require('../validators/validate_fields')
const router= express.Router();
//using express router we can do request routing of get post or any other method
//kind of middleware using routes
router.get('/getPosts', getPosts);
//we need to validate the request before passing it to createPost method itself
//router.post('/createPost', postController.createPost);
//requireSignin methods validates signin by checking the token
router.post('/createPost/:userId', requireSignin, createPost, validator.createPostValidator);
router.get('/getPostsByUser/:userId', requireSignin, getPostsByUser);
router.delete('/deletePostById/:postId', requireSignin, isPoster, deletePostById);
router.put('/updatePostById/:postId', requireSignin, isPoster, updatePostById);
//look for the param in the request. Call userById method if userId param exists in the request
//if any route contains userId then firstly app.js executes userById method
router.param("userId", userById);
router.param("postId", postById);

module.exports= router;

