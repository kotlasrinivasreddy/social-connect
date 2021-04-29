
const model_post= require('../models/post');
const formidable= require('formidable');
const _ = require('lodash'); //general syntax is referring lodash by _ (underscore)
const fs= require('fs');  //node js core module file system... it will give us access to fs
let uuidv1 = require('uuidv1');

//console.log("printing unique identifier: " + uuidv1())
//directly exporting the function

exports.postById = (req, res, next, id) => {
	//console.log("inside postById method and id is: " + id);
	//model_post.find(id)
	model_post.find({_id: id})
		.populate("postedBy", "_id name")
		.exec((error, post) => {
			if(error || !post[0]) //post will be array of single object
				return res.status(400).json({
					error: error,
					message: "error or the post with given id is not found"
				});
			//console.log("printing inside postById: "+ post);
			req.post=post; //adding post as the post field to the req object
			//console.log("successfully attached the post info to request's post field");
			next();
		});
};

exports.getPosts = (req, res) => {
	//model_post refers to the post collection in the database
	//find() method gets all the documents from the database
	 const posts= model_post.find()
		 .populate("postedBy", "_id name")
		 .select("_id title body created")
		 .sort({created: -1}) // -1 to sort on reverse order of created date
		 .then((posts) => {
		 	res.json(posts);
		 })
		 .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
	//console.log(JSON.stringify(req.body));
	//console.log("inside the createPost method");
	//this package must run before validation, change in routes
	let form= new formidable.IncomingForm();
	form.keepExtensions = true; //we want keep the extension intact
	form.parse(req, (error, fields, files) => {
		console.log("inside the parse method");
		if(error) {
			//console.log("inside error if condition");
			return res.status(400).json({
				error: "image could not be uploaded"
			});
		}

		let post= new model_post(fields);
		//console.log("actual post is : ", post);
		//we don't want to print hashed_password, salt, _v
		req.profile.hashed_password = undefined;
		req.profile.salt = undefined;
		req.profile.__v = undefined;
		post.postedBy = req.profile;
		if(files.photo)
		{
			//console.log("field photo from model: ", post.photo);
			post.photo.data= fs.readFileSync(files.photo.path);
			post.photo.contentType= files.photo.type;
		}
		else //we give {} as default photo. so making it undefined if we don't get photo from front end
			post.photo= undefined;
		post.save( (error, result) => {
			if(error)
				return res.status(400).json(error);
			return 	res.json(result);
		});

	}); // end of parse form
	//next();
}; // end of createPost

exports.getPostsByUser = (req, res) => {
	//finding posts by using postedBy field of the post
	//we have to use populate method because postedBy is referring to some other schema
	//otherwise we can use select if they are simple fields
	model_post.find({postedBy: req.profile._id})
		.populate("postedBy", "_id name")
		.sort("created")
		.exec( (error, posts) => {
			if(error)
				return res.status(400).json(error);
			res.json(posts);
		});
};

exports.isPoster = (req, res, next) => {
	//console.log("inside isPoster method and");
	//req.post is an array of objects..normally accessing req.post.postedBy gives undefined object
	//console.log("printing req.post: "+ JSON.stringify(req.post[0]));
	//console.log("printing req.auth: "+ JSON.stringify(req.auth._id));
	let isPoster = req.post[0] && req.auth && req.post[0].postedBy._id.toString() === req.auth._id.toString();
	//console.log("isPoster value: "+ isPoster);
	if(!isPoster)
		return res.status(403).json({
			error: "User is not authorized to do this action"
		});
	next(); //let the application flow to the next middleware
};

exports.deletePostById = (req, res) => {
	//console.log("inside deletePostById method");
	//req.post is an array of objects..normally accessing req.post.postedBy gives undefined object
	// access as req.post[0]... as we search using post id we get single object in the array
	let post= req.post[0];
	post.remove( (error, post) => {
		if(error)
			return res.status(400).json(error);

		return res.json({
			message: "successfully deleted the post"
		});
	});
}; //end of deletePostById

//method for user information/profile update  -- rewriting to handle form data
exports.updatePostById = (req, res) => {
	let form= new formidable.IncomingForm();
	form.keepExtensions= true;
	form.parse( req, (error, fields, files) => {
		if(error)
			return res.status(400).json({error: "problems while uploading post pic"});
		//saving post
		let post= req.post[0];
		post= _.extend(post, fields);
		post.updated= Date.now();
		if(files.photo){
			post.photo.data= fs.readFileSync(files.photo.path); //photo is the name in the front end form
			post.photo.contentType= files.photo.type
			//console.log("entered editing photo to new photo");
		}
		post.save( (error, result) => {
			if(error)
			res.json({
				error: "You're not authorized to perform update operation"
			});
			res.json(post);
		})

	}) //end of form parse
}; // end of updatePostById method


// exports.updatePostById = (req, res, next) => {
// 	//when we provide postId in the request url, automatically postById method will be executed and
// 	// attaches the post info from database as the post field to the request
// 	let post= req.post[0];
// 	//we use extend method of lodash to update the post
// 	//we update the source object(from database) with given fields in the req.body
// 	//if the fields in the req body are different from post fields then updating
// 	post = _.extend(post, req.body);
// 	//filling the updated field of post
// 	post.updated = Date.now();
// 	//finally saving the changes of post object to the database
// 	post.save( (error) => {
// 		if(error)
// 			res.json({
// 				error: "You're not authorized to perform update operation"
// 			});
// 		//if no error while saving .. then user friendly response with updated fields
// 		res.json({post});
// 	});
// }; // end of update post method

exports.postPhoto= (req, res, next) => {
	//console.log("inside post photo", req.post);
	//console.log("inside post photo method", req.post[0].photo);
	if(req.post[0].photo.data){
		res.set(("Content-Type", req.post[0].photo.contentType));
		return res.send(req.post[0].photo.data);
	}
	next();
}; // end of postPhoto method

exports.singlePost= (req, res) => {
	//whenever there is uri param :postId in the request, postById method executes
	//and provides us with the full post corresponding to postId
	//Here we just need to grab that post
	return res.json(req.post[0]);
} // end of singlePost method