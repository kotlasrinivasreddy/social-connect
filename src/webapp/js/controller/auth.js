const jwt= require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()
const User= require('../models/user');
const expressJwt= require('express-jwt');


exports.signup = async (req, res) => {

    //we assume emails are unique and we use to find the duplicates users
    const userExists= await User.findOne({email: req.body.email});
    if(userExists) return res.status(403).json({
        error: "Email is already taken by some other user, please provide different email address"
    });

    //if not creating new user with passed email id
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({
        success: "successfully created the user",
        message: "please use same username and password to login"
    });
};  // end of signup method

exports.signin = (req, res) => {
    //find the user based on email -- we will get email and password as request
    //using object destructuring
    const {email, password}= req.body; //we expect to get email, password from req body
    //user find -- we get err or user as return from findOne, use them in callback function
    User.findOne({email}, (error, user) => {
        //if error or no user exists then
        if(error || !user)
        {
            return res.status(401).json({
                error: "user with specified email doesn't exist in the database",
                message: "please signup/create new account "
            });
        }
        //if user is found, match email and password with those already in database
        //creating authenticate method in model and using it here
        if(!user.authenticate(password))
        {
            return res.status(401).json({
                error: "password mismatch",
                message: "please enter the exact password corresponding the login email"
            })
        }
        //generate a token with user_id(email) and secret
        //creating token with jwt secret, _id (which will be generated uniquely in mongodb database)
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        //persist the token as 'token_name' in cookie with expiry date
        res.cookie("token", token, {expire: new Date() +10000});//expire 10000 seconds from current time
        //return response with user and token to the front end
        const {_id, name, email}= user; //object destructuring
        return res.json({token, user: {_id, email, name}});


    }); // end of User.findOne

}; // end of signin method

exports.signout = (req, res) => {
    //to sign out we need to remove/delete the cookie we created while signing in
    res.clearCookie("token"); //there will be no cookie, so user will not be authenticated
    return res.json({message: "successfully logged out"});
    //if we hit from postman, it doesn't clear the cookie as we're not in client side front end
    //it doesn't make sense to hit from postman
}; // end of signout method


exports.requireSignin= expressJwt({
    secret: process.env.JWT_SECRET, //checking secret key
    algorithms: ["HS256"],
    userProperty: "auth", //here name of the property is auth
    //if the token is valid, express jwt appends the verified user_id in an auth key to req object
});