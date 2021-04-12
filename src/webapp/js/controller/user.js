
const _ = require('lodash'); //general syntax is referring lodash by _ (underscore)
const User= require('../models/user'); //user model class containing schema and methods on schema

exports.userById = (req, res, next, id) => {
    User.findById(id).exec( (error, user) => {
        if(error || !user){
            return res.status(400).json({
                error: "user not found"
            });
        }
        //if user is found -- first step --add user info as profile object in request
        req.profile = user;
        next(); // to make middle move to the next
    });
}

exports.hasAuthorization = (req, res) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized)
        return res.status(403).json({
            message: "user is not authorized to access or perform this action"
        });
};

//method to get all users
exports.allUsers = (req, res, next) => {
    User.find( (error, users) => {
        if(error){
            return res.status(400).json({
                error: error
            });
        }
        //if no errors then
        res.json({users});
        next();
    }).select("name email created updated");

}; // end of allUsers method

//method to get single user
// as and when the request contains userId param -- from routes userById method will be called
//userById method attaches user info as profile field to the request
// we can send that that profile as json response
exports.getSingleUser = (req, res) => {
    //we don't want to print hashed_password, salt, _v
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    req.profile.__v = undefined;
    return res.json(req.profile);
};

//method for user information/profile update
exports.updateUser = (req, res) => {
    //when we provide userId in the request url, automatically userById method will be executed and
    // attaches the user info from database as the profile field
    let user= req.profile;
    //we use extend method of lodash to update the user profile
    //we update the source object(from database) with given fields in the req.body
    //if the fields in the req body are different from user fields then updations are performed
    user = _.extend(user, req.body);
    //filling the updated field of user
    user.updated = Date.now();
    //finally saving the changes of user object to the database
    user.save( (error) => {
        if(error)
            res.json({
               error: "You're not authorized to perform update operation"
            });
        //if no error while saving .. then user friendly response with updated fields
        //we don't want to print hashed_password, salt, _v
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        req.profile.__v = undefined;
        res.json({user});
    });
}; // end of update user method

//method to delete user from the social-connect application
exports.deleteUser = (req, res) => {
    //when we provide userId in the request url, automatically userById method will be executed and
    // attaches the user info from database as the profile field
    let user = req.profile;
    user.remove( (error, deletedUser) => {
        if(error)
            return res.status(400).json({
               error: error
            });
        // req.profile.hashed_password = undefined;
        // req.profile.salt = undefined;
        // req.profile.__v = undefined;
        // res.json({deletedUser}); //generally we shouldn't show the deleted user
        res.json({message: "user account deleted successfully"});
    });

};// end of deleteUser method