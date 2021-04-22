
const express= require('express');
const {requireSignin} = require('../controller/auth');
const {userById, allUsers, getSingleUser, updateUser, deleteUser } = require('../controller/user');
const router= express.Router();
//using express router we can do request routing of get post or any other method
//kind of middleware using routes


router.get('/getAllUsers', allUsers); //get allUsers
//make it secure access by checking signin
router.get('/getSingleUser/:userId', requireSignin, getSingleUser); //get single user --path uri param
//to update the user given the userId -- we use put method for updation -- requires signin
router.put('/updateUser/:userId', requireSignin, updateUser);
router.delete('/deleteUser/:userId', requireSignin, deleteUser);
//rather than creating different paths as getSingleUser, updateUser and deleteUser
//we can have common url /user/:userId and methods get, put, delete represents the action of url

//look for the param in the request. Call userById method if userId param exists in the request
//if any route contains userId then firstly app.js executes userById method
router.param("userId", userById);
module.exports= router;

