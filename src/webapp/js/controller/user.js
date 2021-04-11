
const User= require('../models/user'); //user model class containing schema and methods on schema

exports.userById = (req, res, next, id) => {
    User.findById(id).exec( (error, user) => {
        if(error || !user){
            return res.status(400).json({
                error: "user not found"
            })
        }
        //if user is found -- first step --add user info as profile object in request
        req.profile = user;
        next(); // to make middle move to the next
    });
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized)
        return res.status(403).json({
            message: "user is not authorized to access or perform this action"
        })
};