
const model_post= require('../models/post')

let uuidv1 = require('uuidv1')

//console.log("printing unique identifier: " + uuidv1())

//directly exporting the function
exports.getPosts = (req, res) => {
	//model_post refers to the post collection in the database
	//find() method gets all the documents from the database
	 const posts= model_post.find().select("_id title body")
		 .then((posts) => {
		 	res.json({posts});
		 })
		 .catch(err => console.log(err));
};

exports.createPost = (req, res) => {
	//console.log(JSON.stringify(req.body));
	const post_object= new model_post(req.body); //creating post object with request body
	//console.log("creating post: "+ post_object);
	//no need to handle errors here as they're already handled in routes using validate_field.js
	post_object.save().then(result => {
		res.status(200).json({
			post: result
		});
	});
};