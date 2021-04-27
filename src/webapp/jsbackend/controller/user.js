
const _ = require('lodash'); //general syntax is referring lodash by _ (underscore)
const User= require('../models/user'); //user model class containing schema and methods on schema
const formidable= require('formidable');
const fs= require('fs');

exports.userById = (req, res, next, id) => {
    User.findById(id)
        //populate followers and following users' list
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec( (error, user) => {
        if(error || !user){
            return res.status(400).json({
                error: "user not found"
            });
        }
        //if user is found -- first step --add user info as profile object in request
        req.profile = user;
        next(); // to make middle move to the next
    });
} //end of userById method

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
        res.json(users);
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
    let form= new formidable.IncomingForm();
    form.keepExtensions= true;
    form.parse( req, (error, fields, files) => {
        if(error)
            return res.status(400).json({error: "problems while uploading profile pic"});
        //saving user
        let user= req.profile;
        user= _.extend(user, fields);
        user.updated= Date.now();
        if(files.photo){
            user.photo.data= fs.readFileSync(files.photo.path); //photo is the name in the front end form
            user.photo.contentType= files.photo.type
            //console.log("entered editing photo to new photo");
        }
        user.save( (error, result) => {
            if(error)
                return res.status(400).json({error});
            user.hashed_password= undefined; //making hashed password not available for front end
            user.salt= undefined;
            res.json(user);
        })

    }) //end of form parse
}; // end of updateUser method

// exports.updateUser = (req, res) => {
//     //when we provide userId in the request url, automatically userById method will be executed and
//     // attaches the user info from database as the profile field
//     let user= req.profile;
//     //we use extend method of lodash to update the user profile
//     //we update the source object(from database) with given fields in the req.body
//     //if the fields in the req body are different from user fields then updations are performed
//     user = _.extend(user, req.body);
//     //filling the updated field of user
//     user.updated = Date.now();
//     //finally saving the changes of user object to the database
//     user.save( (error) => {
//         if(error)
//             res.json({
//                error: "You're not authorized to perform update operation"
//             });
//         //if no error while saving .. then user friendly response with updated fields
//         //we don't want to print hashed_password, salt, _v
//         req.profile.hashed_password = undefined;
//         req.profile.salt = undefined;
//         req.profile.__v = undefined;
//         res.json({user});
//     });
// }; // end of update user method

exports.userPhoto= (req, res, next) => {
    if(req.profile.photo.data){
        res.set(("Content-Type", req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
}; // end of user photo

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

// methods for implementing follow and unfollow
exports.addFollowing = (req, res, next) => {
    //we get userId(logged in userId) and whom he clicked to follow from front end request
    User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}},
        (error, result) => {
        if(error)
            return res.status(400).json({error});
        next();
    });
} // end of addFollowing method

exports.addFollower = (req, res, next) => {
    //add logged in userId to the followId's follower list    new: true to get updated response
    User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
        //populating for returning response after executing addFollowing, addFollower
        //make sure to put addFollowing and then addFollower in the router call so that
        //response will be returned after executing both the functions
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((error, result) => {
            if(error)
                return res.status(400).json({error});

            result.hashed_password= undefined;
            result.salt= undefined;
            res.json(result);
        });

} // end of addFollower method


exports.removeFollowing = (req, res, next) => {
    //we get userId(logged in userId) and whom he clicked to follow from front end request
    User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}},
        (error, result) => {
            if(error)
                return res.status(400).json({error});
            next();
        });
} // end of removeFollowing method

exports.removeFollower = (req, res, next) => {
    //add logged in userId to the followId's follower list    new: true to get updated response
    User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
        //populating for returning response after executing addFollowing, addFollower
        //make sure to put addFollowing and then addFollower in the router call so that
        //response will be returned after executing both the functions
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((error, result) => {
            if(error)
                return res.status(400).json({error});

            result.hashed_password= undefined;
            result.salt= undefined;
            res.json(result);
        });

} // end of removeFollower method

exports.findPeople= (req, res) => {
    //get all the users whom the current signedin user is following
    let already_following = req.profile.following;
    already_following.push(req.profile._id); // pushing user himself to the aside list
    //we find the users by _id --  not including users already_following users
    User.find({_id: {$nin: already_following}}, (error, users) => {
        if(error)
            return res.status(400).json({error});

        res.json(users); // returning users whom we can follow
        //we don't have to send everything, just send name of the users
    }).select("_id name");

}; // end of findPeople method

