

const express= require('express');
const app= express();
const morgan = require('morgan');
const postRoutes= require('./routes/post');
const authRoutes= require('./routes/auth');
const userRoutes= require('./routes/user');
const expressValidator= require('express-validator');
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const mongoose = require('mongoose');
// load env variables
const dotenv = require('dotenv');
dotenv.config()


//middleware using morgan
app.use(morgan("dev"));

//changing app.get to app.use as we're using router
app.use(bodyParser.json()); //using bodyParser as middleware- now any incoming request with body parsed to json
app.use(cookieParser());
app.use(expressValidator());
//all the app.use statements should be before routes because we need to load add everything to app and then
//perform the routing of requests
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({
			error: "unauthorized access",
			message: "invalid token"
		});
	}
});

//const port= 3000
app.listen(process.env.PORT, () => {
	console.log("A node js API is listening on port: "+ process.env.PORT)

});

//console.log("MONGO URI IS " + process.env.MONGO_URI);
//console.log("Port number is: "+ process.env.PORT);

//db connection -- db name is "connectDB" if not already present, will be created
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
	console.log(`DB connection error: ${err.message}`)
});
